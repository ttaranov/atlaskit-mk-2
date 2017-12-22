import * as assert from 'assert';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { insertPoint } from 'prosemirror-transform';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import {
  EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
  Transaction,
} from 'prosemirror-state';
import {
  Context,
  DefaultMediaStateManager,
  MediaProvider,
  MediaState,
  MediaStateManager,
  UploadParams,
  ContextConfig,
  ContextFactory,
} from '@atlaskit/media-core';
import {
  copyPrivateMediaAttributes,
  MediaType,
  MediaSingleLayout,
} from '@atlaskit/editor-common';

import analyticsService from '../../analytics/service';
import { ErrorReporter, isImage } from '../../utils';
import { Dispatch } from '../../editor/event-dispatcher';
import { nodeViewFactory } from '../../nodeviews';
import { EditorAppearance } from '../../editor/types/editor-props';
import { ProsemirrorGetPosHandler } from '../../nodeviews';
import DropPlaceholder from '../../ui/Media/DropPlaceholder';
import {
  ReactMediaGroupNode,
  ReactMediaNode,
  ReactMediaSingleNode,
} from '../../nodeviews';

import PickerFacadeType from './picker-facade';
import { MediaPluginOptions } from './media-plugin-options';
import keymapPlugin from './keymap';
import { insertLinks, URLInfo, detectLinkRangesInSteps } from './media-links';
import { insertMediaGroupNode } from './media-files';
import { insertMediaSingleNode } from './media-single';
import { removeMediaNode, splitMediaGroup } from './media-common';
import PickerFacade from './picker-facade';

const MEDIA_END_STATES = ['ready', 'error', 'cancelled'];

export type PluginStateChangeSubscriber = (state: MediaPluginState) => any;

export interface MediaNodeWithPosHandler {
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
}

export class MediaPluginState {
  public allowsMedia: boolean = false;
  public allowsUploads: boolean = false;
  public allowsLinks: boolean = false;
  public stateManager: MediaStateManager;
  public pickers: PickerFacadeType[] = [];
  public binaryPicker?: PickerFacadeType;
  public ignoreLinks: boolean = false;
  public waitForMediaUpload: boolean = true;
  public showDropzone: boolean = false;
  private mediaNodes: MediaNodeWithPosHandler[] = [];
  private pendingTask = Promise.resolve<MediaState | null>(null);
  private options: MediaPluginOptions;
  private view: EditorView;
  private pluginStateChangeSubscribers: PluginStateChangeSubscriber[] = [];
  private useDefaultStateManager = true;
  private destroyed = false;
  private mediaProvider: MediaProvider;
  private errorReporter: ErrorReporter;
  private popupPicker?: PickerFacadeType;
  private clipboardPicker?: PickerFacadeType;
  private dropzonePicker?: PickerFacadeType;
  private linkRanges: Array<URLInfo>;
  private editorAppearance: EditorAppearance;

  constructor(
    state: EditorState,
    options: MediaPluginOptions,
    editorAppearance?: EditorAppearance,
  ) {
    this.options = options;
    this.editorAppearance = editorAppearance;
    this.waitForMediaUpload =
      options.waitForMediaUpload === undefined
        ? true
        : options.waitForMediaUpload;

    const { nodes } = state.schema;
    assert(
      nodes.media && nodes.mediaGroup,
      'Editor: unable to init media plugin - media or mediaGroup node absent in schema',
    );

    this.stateManager = new DefaultMediaStateManager();
    options.providerFactory.subscribe(
      'mediaProvider',
      (name, provider: Promise<MediaProvider>) =>
        this.setMediaProvider(provider),
    );

    this.errorReporter = options.errorReporter || new ErrorReporter();
  }

  subscribe(cb: PluginStateChangeSubscriber) {
    this.pluginStateChangeSubscribers.push(cb);
    cb(this);
  }

  unsubscribe(cb: PluginStateChangeSubscriber) {
    const { pluginStateChangeSubscribers } = this;
    const pos = pluginStateChangeSubscribers.indexOf(cb);

    if (pos > -1) {
      pluginStateChangeSubscribers.splice(pos, 1);
    }
  }

  setMediaProvider = async (mediaProvider?: Promise<MediaProvider>) => {
    if (!mediaProvider) {
      this.destroyPickers();

      this.allowsLinks = false;
      this.allowsUploads = false;
      this.allowsMedia = false;
      this.notifyPluginStateSubscribers();

      return;
    }

    // TODO disable (not destroy!) pickers until mediaProvider is resolved
    let resolvedMediaProvider: MediaProvider;

    try {
      resolvedMediaProvider = await mediaProvider;

      assert(
        resolvedMediaProvider && resolvedMediaProvider.viewContext,
        `MediaProvider promise did not resolve to a valid instance of MediaProvider - ${resolvedMediaProvider}`,
      );
    } catch (err) {
      const wrappedError = new Error(
        `Media functionality disabled due to rejected provider: ${err.message}`,
      );
      this.errorReporter.captureException(wrappedError);

      this.destroyPickers();

      this.allowsLinks = false;
      this.allowsUploads = false;
      this.allowsMedia = false;
      this.notifyPluginStateSubscribers();

      return;
    }

    this.mediaProvider = resolvedMediaProvider;
    this.allowsMedia = true;

    // release all listeners for default state manager
    const { stateManager } = resolvedMediaProvider;
    if (stateManager && this.useDefaultStateManager) {
      (stateManager as DefaultMediaStateManager).destroy();
      this.useDefaultStateManager = false;
    }

    if (stateManager) {
      this.stateManager = stateManager;
    }

    this.allowsLinks = !!resolvedMediaProvider.linkCreateContext;
    this.allowsUploads = !!resolvedMediaProvider.uploadContext;
    const { view, allowsUploads } = this;

    // make sure editable DOM node is mounted
    if (view.dom.parentNode) {
      // make PM plugin aware of the state change to update UI during 'apply' hook
      view.dispatch(view.state.tr.setMeta(stateKey, { allowsUploads }));
    }

    if (this.allowsUploads) {
      const uploadContext = await resolvedMediaProvider.uploadContext;

      if (resolvedMediaProvider.uploadParams && uploadContext) {
        this.initPickers(resolvedMediaProvider.uploadParams, uploadContext);
      } else {
        this.destroyPickers();
      }
    } else {
      this.destroyPickers();
    }

    this.notifyPluginStateSubscribers();
  };

  insertFile = (mediaState: MediaState): void => {
    // tslint:disable-next-line:no-console
    console.warn(
      'This API is deprecated. Please use insertFiles(mediaStates: MediaState[]) instead',
    );
    this.insertFiles([mediaState]);
  };

  insertFiles = (mediaStates: MediaState[]): void => {
    const { stateManager } = this;
    const { mediaSingle } = this.view.state.schema.nodes;
    const collection = this.collectionFromProvider();
    if (!collection) {
      return;
    }

    const areImages = mediaStates.every(mediaState =>
      isImage(mediaState.fileMimeType),
    );

    mediaStates.forEach(mediaState =>
      this.stateManager.subscribe(mediaState.id, this.handleMediaState),
    );

    if (this.editorAppearance !== 'message' && areImages && mediaSingle) {
      mediaStates.forEach(mediaState =>
        this.stateManager.subscribe(
          mediaState.id,
          this.handleMediaSingleInsertion,
        ),
      );
    } else {
      insertMediaGroupNode(this.view, mediaStates, collection);
    }

    const isEndState = (state: MediaState) =>
      state.status && MEDIA_END_STATES.indexOf(state.status) !== -1;

    this.pendingTask = mediaStates
      .filter(state => !isEndState(state))
      .reduce((promise, state) => {
        // Chain the previous promise with a new one for this media item
        return new Promise<MediaState | null>((resolve, reject) => {
          const onStateChange = newState => {
            // When media item reaches its final state, remove listener and resolve
            if (isEndState(newState)) {
              stateManager.unsubscribe(state.id, onStateChange);
              resolve(newState);
            }
          };

          stateManager.subscribe(state.id, onStateChange);
        }).then(() => promise);
      }, this.pendingTask);

    const { view } = this;
    if (!view.hasFocus()) {
      view.focus();
    }
  };

  handleMediaSingleInsertion = (state: MediaState) => {
    if (state.status === 'uploading') {
      const collection = this.collectionFromProvider();
      insertMediaSingleNode(this.view, state, collection);
    }
    this.stateManager.unsubscribe(state.id, this.handleMediaSingleInsertion);
  };

  insertLinks = async () => {
    const { mediaProvider } = this;

    if (!mediaProvider) {
      return;
    }

    const { linkCreateContext } = this.mediaProvider;

    if (!linkCreateContext) {
      return;
    }

    let linkCreateContextInstance = await linkCreateContext;
    if (!linkCreateContextInstance) {
      return;
    }

    if (!(linkCreateContextInstance as Context).addLinkItem) {
      linkCreateContextInstance = ContextFactory.create(
        linkCreateContextInstance as ContextConfig,
      );
    }

    return insertLinks(
      this.view,
      this.stateManager,
      this.handleMediaState,
      this.linkRanges,
      linkCreateContextInstance as Context,
      this.collectionFromProvider(),
    );
  };

  splitMediaGroup = (): boolean => {
    return splitMediaGroup(this.view);
  };

  insertFileFromDataUrl = (url: string, fileName: string) => {
    const { binaryPicker } = this;
    assert(
      binaryPicker,
      'Unable to insert file because media pickers have not been initialized yet',
    );

    binaryPicker!.upload(url, fileName);
  };

  showMediaPicker = () => {
    if (!this.popupPicker) {
      return;
    }

    this.popupPicker.show();
  };

  /**
   * Returns a promise that is resolved after all pending operations have been finished.
   * An optional timeout will cause the promise to reject if the operation takes too long
   *
   * NOTE: The promise will resolve even if some of the media have failed to process.
   */
  waitForPendingTasks = (
    timeout?: Number,
    lastTask?: Promise<MediaState | null>,
  ) => {
    if (lastTask && this.pendingTask === lastTask) {
      return lastTask;
    }

    const chainedPromise = this.pendingTask.then(() =>
      // Call ourselves to make sure that no new pending tasks have been
      // added before the current promise has resolved.
      this.waitForPendingTasks(undefined, this.pendingTask!),
    );

    if (!timeout) {
      return chainedPromise;
    }

    let rejectTimeout: number;
    const timeoutPromise = new Promise((resolve, reject) => {
      rejectTimeout = setTimeout(
        () =>
          reject(new Error(`Media operations did not finish in ${timeout} ms`)),
        timeout,
      );
    });

    return Promise.race([
      timeoutPromise,
      chainedPromise.then(() => {
        clearTimeout(rejectTimeout);
      }),
    ]);
  };

  setView(view: EditorView) {
    this.view = view;
  }

  /**
   * Called from React UI Component when user clicks on "Delete" icon
   * inside of it
   */
  handleMediaNodeRemoval = (node: PMNode, getPos: ProsemirrorGetPosHandler) => {
    removeMediaNode(this.view, node, getPos);
  };

  /**
   * This is called when media node is removed from media group node view
   */
  cancelInFlightUpload(id: string) {
    const mediaNodeWithPos = this.findMediaNode(id);
    if (!mediaNodeWithPos) {
      return;
    }
    const status = this.getMediaNodeStateStatus(id);

    switch (status) {
      case 'uploading':
      case 'processing':
        this.pickers.forEach(picker => picker.cancel(id));
    }
  }

  /**
   * Called from React UI Component on componentDidMount
   */
  handleMediaNodeMount = (node: PMNode, getPos: ProsemirrorGetPosHandler) => {
    this.mediaNodes.push({ node, getPos });
  };

  /**
   * Called from React UI Component on componentWillUnmount and componentWillReceiveProps
   * when React component's underlying node property is replaced with a new node
   */
  handleMediaNodeUnmount = (oldNode: PMNode) => {
    this.mediaNodes = this.mediaNodes.filter(({ node }) => oldNode !== node);
  };

  align = (layout: MediaSingleLayout): boolean => {
    if (!this.isMediaNodeSelection()) {
      return false;
    }
    const { selection: { from }, schema, tr } = this.view.state;
    this.view.dispatch(
      tr.setNodeMarkup(from - 1, schema.nodes.mediaSingle, {
        layout,
      }),
    );
    return true;
  };

  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    const { mediaNodes } = this;
    mediaNodes.splice(0, mediaNodes.length);

    this.destroyPickers();
  }

  findMediaNode = (id: string): MediaNodeWithPosHandler | null => {
    const { mediaNodes } = this;

    // Array#find... no IE support
    return mediaNodes.reduce(
      (
        memo: MediaNodeWithPosHandler | null,
        nodeWithPos: MediaNodeWithPosHandler,
      ) => {
        if (memo) {
          return memo;
        }

        const { node } = nodeWithPos;
        if (node.attrs.id === id) {
          return nodeWithPos;
        }

        return memo;
      },
      null,
    );
  };

  detectLinkRangesInSteps = (tr: Transaction, oldState: EditorState) => {
    const { link } = this.view.state.schema.marks;
    this.linkRanges = [];

    if (this.ignoreLinks) {
      this.ignoreLinks = false;
      return this.linkRanges;
    }

    if (!link || !this.allowsLinks) {
      return this.linkRanges;
    }

    this.linkRanges = detectLinkRangesInSteps(
      tr,
      link,
      oldState.selection.$anchor.pos,
    );
  };

  private destroyPickers = () => {
    const { pickers } = this;

    pickers.forEach(picker => picker.destroy());
    pickers.splice(0, pickers.length);

    this.popupPicker = undefined;
    this.binaryPicker = undefined;
  };

  private initPickers(uploadParams: UploadParams, context: ContextConfig) {
    if (this.destroyed) {
      return;
    }

    const { errorReporter, pickers, stateManager } = this;

    // create pickers if they don't exist, re-use otherwise
    if (!pickers.length) {
      pickers.push(
        (this.binaryPicker = new PickerFacade(
          'binary',
          uploadParams,
          context,
          stateManager,
          errorReporter,
        )),
      );
      pickers.push(
        (this.popupPicker = new PickerFacade(
          'popup',
          uploadParams,
          context,
          stateManager,
          errorReporter,
        )),
      );
      pickers.push(
        (this.clipboardPicker = new PickerFacade(
          'clipboard',
          uploadParams,
          context,
          stateManager,
          errorReporter,
        )),
      );
      pickers.push(
        (this.dropzonePicker = new PickerFacade(
          'dropzone',
          uploadParams,
          context,
          stateManager,
          errorReporter,
        )),
      );

      pickers.forEach(picker => {
        picker.onNewMedia(this.insertFiles);
        picker.onNewMedia(this.trackNewMediaEvent(picker.type));
      });
      this.dropzonePicker.onDrag(this.handleDrag);
    }

    if (this.popupPicker) {
      this.popupPicker.hide();
    }

    // set new upload params for the pickers
    pickers.forEach(picker => picker.setUploadParams(uploadParams));
  }

  private trackNewMediaEvent(pickerType) {
    return (mediaStates: MediaState[]) => {
      mediaStates.forEach(mediaState => {
        analyticsService.trackEvent(
          `atlassian.editor.media.file.${pickerType}`,
          mediaState.fileMimeType
            ? { fileMimeType: mediaState.fileMimeType }
            : {},
        );
      });
    };
  }

  private collectionFromProvider(): string | undefined {
    return (
      this.mediaProvider &&
      this.mediaProvider.uploadParams &&
      this.mediaProvider.uploadParams.collection
    );
  }

  private handleMediaState = (state: MediaState) => {
    switch (state.status) {
      case 'error':
        this.removeNodeById(state.id);
        const { uploadErrorHandler } = this.options;

        if (uploadErrorHandler) {
          uploadErrorHandler(state);
        }
        break;

      case 'ready':
        this.stateManager.unsubscribe(state.id, this.handleMediaState);
        this.replaceTemporaryNode(state);
        break;
    }
  };

  private notifyPluginStateSubscribers = () => {
    this.pluginStateChangeSubscribers.forEach(cb => cb.call(cb, this));
  };

  private removeNodeById = (id: string) => {
    // TODO: we would like better error handling and retry support here.
    const mediaNodeWithPos = this.findMediaNode(id);
    if (mediaNodeWithPos) {
      removeMediaNode(
        this.view,
        mediaNodeWithPos.node,
        mediaNodeWithPos.getPos,
      );
    }
  };

  private replaceTemporaryNode = (state: MediaState) => {
    const { view } = this;
    if (!view) {
      return;
    }

    const { id, publicId, thumbnail } = state;

    const mediaNodeWithPos = this.findMediaNode(id);
    if (!mediaNodeWithPos) {
      return;
    }

    const { getPos, node: mediaNode } = mediaNodeWithPos;

    const newNode = view.state.schema.nodes.media!.create({
      ...mediaNode.attrs,
      id: publicId,
      width: thumbnail && thumbnail.width,
      height: thumbnail && thumbnail.height,
    });

    // Copy all optional attributes from old node
    copyPrivateMediaAttributes(mediaNode.attrs, newNode.attrs);

    // replace the old node with a new one
    const nodePos = getPos();
    const tr = view.state.tr.replaceWith(
      nodePos,
      nodePos + mediaNode.nodeSize,
      newNode,
    );
    view.dispatch(tr.setMeta('addToHistory', false));
  };

  removeSelectedMediaNode = (): boolean => {
    const { view } = this;
    if (this.isMediaNodeSelection()) {
      const { from, node } = view.state.selection as NodeSelection;
      removeMediaNode(view, node, () => from);
      return true;
    }
    return false;
  };

  private isMediaNodeSelection() {
    const { selection, schema } = this.view.state;
    return (
      selection instanceof NodeSelection &&
      selection.node.type === schema.nodes.media
    );
  }

  /**
   * Since we replace nodes with public id when node is finalized
   * stateManager contains no information for public ids
   */
  private getMediaNodeStateStatus = (id: string) => {
    const { stateManager } = this;
    const state = stateManager.getState(id);

    return (state && state.status) || 'ready';
  };

  private handleDrag = (dragState: 'enter' | 'leave') => {
    const isActive = dragState === 'enter';
    if (this.showDropzone === isActive) {
      return;
    }
    this.showDropzone = isActive;

    const { dispatch, state } = this.view;
    // Trigger state change to be able to pick it up in the decorations handler
    dispatch(state.tr);
  };
}

const createDropPlaceholder = (editorAppearance?: EditorAppearance) => {
  const dropPlaceholder = document.createElement('div');
  if (editorAppearance === 'full-page') {
    ReactDOM.render(
      React.createElement(DropPlaceholder, { type: 'single' }),
      dropPlaceholder,
    );
  } else {
    ReactDOM.render(React.createElement(DropPlaceholder), dropPlaceholder);
  }
  return dropPlaceholder;
};

export const stateKey = new PluginKey('mediaPlugin');
export const getMediaPluginState = (state: EditorState) =>
  stateKey.getState(state) as MediaPluginState;

export const createPlugin = (
  schema: Schema,
  options: MediaPluginOptions,
  dispatch?: Dispatch,
  editorAppearance?: EditorAppearance,
) => {
  const dropPlaceholder = createDropPlaceholder(editorAppearance);

  return new Plugin({
    state: {
      init(config, state) {
        return new MediaPluginState(state, options, editorAppearance);
      },
      apply(tr, pluginState: MediaPluginState, oldState, newState) {
        pluginState.detectLinkRangesInSteps(tr, oldState);

        // Ignore creating link cards during link editing
        const { link } = oldState.schema.marks;
        const { nodeAfter, nodeBefore } = newState.selection.$from;

        if (
          (nodeAfter && link.isInSet(nodeAfter.marks)) ||
          (nodeBefore && link.isInSet(nodeBefore.marks))
        ) {
          pluginState.ignoreLinks = true;
        }

        const meta = tr.getMeta(stateKey);
        if (meta && dispatch) {
          const { showMediaPicker } = pluginState;
          const { allowsUploads } = meta;
          dispatch(stateKey, { allowsUploads, showMediaPicker });
        }

        // NOTE: We're not calling passing new state to the Editor, because we depend on the view.state reference
        //       throughout the lifetime of view. We injected the view into the plugin state, because we dispatch()
        //       transformations from within the plugin state (i.e. when adding a new file).
        return pluginState;
      },
    },
    key: stateKey,
    view: view => {
      const pluginState = getMediaPluginState(view.state);
      pluginState.setView(view);

      return {
        update: () => {
          pluginState.insertLinks();
        },
      };
    },
    props: {
      decorations: state => {
        const pluginState = getMediaPluginState(state);
        if (!pluginState.showDropzone) {
          return;
        }

        const { schema, selection: { $anchor } } = state;
        // When a media is already selected
        if (state.selection instanceof NodeSelection) {
          return;
        }

        let pos: number | null | void = $anchor.pos;
        if (
          $anchor.parent.type !== schema.nodes.paragraph &&
          $anchor.parent.type !== schema.nodes.codeBlock
        ) {
          pos = insertPoint(state.doc, pos, schema.nodes.mediaGroup);
        }

        if (pos === null || pos === undefined) {
          return;
        }

        const dropPlaceholders: Decoration[] = [
          Decoration.widget(pos, dropPlaceholder, { key: 'drop-placeholder' }),
        ];
        return DecorationSet.create(state.doc, dropPlaceholders);
      },
      nodeViews: {
        mediaGroup: nodeViewFactory(
          options.providerFactory,
          {
            mediaGroup: ReactMediaGroupNode,
            media: ReactMediaNode,
          },
          true,
        ),
        mediaSingle: nodeViewFactory(
          options.providerFactory,
          {
            mediaSingle: ReactMediaSingleNode,
            media: ReactMediaNode,
          },
          true,
        ),
      },
      handleTextInput(
        view: EditorView,
        from: number,
        to: number,
        text: string,
      ): boolean {
        getMediaPluginState(view.state).splitMediaGroup();
        return false;
      },
    },
  });
};

const plugins = (
  schema: Schema,
  options: MediaPluginOptions,
  dispatch?: Dispatch,
  editorAppearance?: EditorAppearance,
) => {
  return [
    createPlugin(schema, options, dispatch, editorAppearance),
    keymapPlugin(schema),
  ].filter(plugin => !!plugin) as Plugin[];
};

export default plugins;

export interface MediaData {
  id: string;
  type?: MediaType;
}
