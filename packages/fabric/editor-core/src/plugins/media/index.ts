import analyticsService from '../../analytics/service';
import * as assert from 'assert';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  Context,
  DefaultMediaStateManager,
  MediaProvider,
  MediaState,
  MediaStateManager,
  UploadParams,
  ContextConfig,
  ContextFactory
} from '@atlaskit/media-core';

import {
  copyOptionalMediaAttributes, MediaType
} from '@atlaskit/editor-common';

import { Node as PMNode, Schema } from 'prosemirror-model';
import { EditorState, NodeSelection, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { insertPoint } from 'prosemirror-transform';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

import PickerFacadeType from './picker-facade';
import { ErrorReporter } from '../../utils';
import { Dispatch } from '../../editor/event-dispatcher';
import { MediaPluginOptions } from './media-plugin-options';
import { ProsemirrorGetPosHandler } from '../../nodeviews';
import { nodeViewFactory } from '../../nodeviews';
import { ReactMediaGroupNode, ReactMediaNode, ReactSingleImageNode } from '../../nodeviews';
import keymapPlugin from './keymap';
import { insertLinks, URLInfo, detectLinkRangesInSteps } from './media-links';
import { insertFile } from './media-files';
import { removeMediaNode, splitMediaGroup } from './media-common';
import { Alignment, Display } from './single-image';
import PickerFacade from './picker-facade';
import DropPlaceholder from '../../ui/Media/DropPlaceholder';

const MEDIA_RESOLVE_STATES = ['ready', 'error', 'cancelled'];

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

  constructor(state: EditorState, options: MediaPluginOptions) {
    this.options = options;
    this.waitForMediaUpload = options.waitForMediaUpload === undefined ? true : options.waitForMediaUpload;

    const { nodes } = state.schema;
    assert(nodes.media && nodes.mediaGroup, 'Editor: unable to init media plugin - media or mediaGroup node absent in schema');

    this.stateManager = new DefaultMediaStateManager();
    options.providerFactory.subscribe('mediaProvider', (name, provider: Promise<MediaProvider>) => this.setMediaProvider(provider));

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
        `MediaProvider promise did not resolve to a valid instance of MediaProvider - ${resolvedMediaProvider}`
      );
    } catch (err) {
      const wrappedError = new Error(`Media functionality disabled due to rejected provider: ${err.message}`);
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
  }

  insertFile = (mediaState: MediaState): void => {
    const collection = this.collectionFromProvider();
    if (!collection) {
      return;
    }

    this.stateManager.subscribe(mediaState.id, this.handleMediaState);

    insertFile(this.view, mediaState, collection);

    const { view } = this;
    if (!view.hasFocus()) {
      view.focus();
    }
  }

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
      linkCreateContextInstance = ContextFactory.create(linkCreateContextInstance as ContextConfig);
    }

    return insertLinks(
      this.view,
      this.stateManager,
      this.handleMediaState,
      this.linkRanges,
      linkCreateContextInstance as Context,
      this.collectionFromProvider()
    );
  }

  splitMediaGroup = (): boolean => {
    return splitMediaGroup(this.view);
  }

  insertFileFromDataUrl = (url: string, fileName: string) => {
    const { binaryPicker } = this;
    assert(binaryPicker, 'Unable to insert file because media pickers have not been initialized yet');

    binaryPicker!.upload(url, fileName);
  }

  showMediaPicker = () => {
    if (!this.popupPicker) {
      return;
    }

    this.popupPicker.show();
  }

  /**
   * Returns a promise that is resolved after all pending operations have been finished.
   * An optional timeout will cause the promise to reject if the operation takes too long
   *
   * NOTE: The promise will resolve even if some of the media have failed to process.
   *
   */
  waitForPendingTasks = (timeout?: Number) => {
    const { mediaNodes, stateManager } = this;

    return new Promise<void>((resolve, reject) => {
      if (timeout) {
        setTimeout(() => reject(new Error(`Media operations did not finish in ${timeout} ms`)), timeout);
      }

      let outstandingNodes = mediaNodes.length;
      if (!outstandingNodes) {
        return resolve();
      }

      function onNodeStateChanged(state: MediaState) {
        const { status } = state;

        if (MEDIA_RESOLVE_STATES.indexOf(status || '') !== -1) {
          onNodeStateReady(state.id);
        }
      }

      function onNodeStateReady(id: string) {
        outstandingNodes--;
        stateManager.unsubscribe(id, onNodeStateChanged);

        if (outstandingNodes <= 0) {
          resolve();
        }
      }

      mediaNodes.forEach(({ node }) => {
        const mediaNodeId = node.attrs.id;
        const nodeCurrentStatus = this.getMediaNodeStateStatus(mediaNodeId);

        if (MEDIA_RESOLVE_STATES.indexOf(nodeCurrentStatus) !== -1) {
          onNodeStateReady(mediaNodeId);
        } else {
          stateManager.subscribe(mediaNodeId, onNodeStateChanged);
        }
      });
    });
  }

  setView(view: EditorView) {
    this.view = view;
  }

  /**
   * Called from React UI Component when user clicks on "Delete" icon
   * inside of it
   */
  handleMediaNodeRemoval = (node: PMNode, getPos: ProsemirrorGetPosHandler) => {
    removeMediaNode(this.view, node, getPos);
  }

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
  }

  /**
   * Called from React UI Component on componentWillUnmount and componentWillReceiveProps
   * when React component's underlying node property is replaced with a new node
   */
  handleMediaNodeUnmount = (oldNode: PMNode) => {
    this.mediaNodes = this.mediaNodes.filter(({ node }) => oldNode !== node);
  }

  align = (alignment: Alignment, display: Display = 'block'): boolean => {
    if (!this.isMediaNodeSelection()) {
      return false;
    }
    const { selection: { from }, schema, tr } = this.view.state;
    this.view.dispatch(tr.setNodeType(from - 1, schema.nodes.singleImage, { alignment, display }));
    return true;
  }

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
    return mediaNodes.reduce((memo: MediaNodeWithPosHandler | null, nodeWithPos: MediaNodeWithPosHandler) => {
      if (memo) {
        return memo;
      }

      const { node } = nodeWithPos;
      if (node.attrs.id === id) {
        return nodeWithPos;
      }

      return memo;
    }, null);
  }

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

    this.linkRanges = detectLinkRangesInSteps(tr, link, oldState.selection.$anchor.pos);
  }

  private destroyPickers = () => {
    const { pickers } = this;

    pickers.forEach(picker => picker.destroy());
    pickers.splice(0, pickers.length);

    this.popupPicker = undefined;
    this.binaryPicker = undefined;
  }

  private initPickers(uploadParams: UploadParams, context: ContextConfig) {
    if (this.destroyed) {
      return;
    }

    const {
      errorReporter,
      pickers,
      stateManager,
    } = this;

    // create pickers if they don't exist, re-use otherwise
    if (!pickers.length) {
      pickers.push(this.binaryPicker = new PickerFacade('binary', uploadParams, context, stateManager, errorReporter));
      pickers.push(this.popupPicker = new PickerFacade('popup', uploadParams, context, stateManager, errorReporter));
      pickers.push(this.clipboardPicker = new PickerFacade('clipboard', uploadParams, context, stateManager, errorReporter));
      pickers.push(this.dropzonePicker = new PickerFacade('dropzone', uploadParams, context, stateManager, errorReporter));

      pickers.forEach(picker => picker.onNewMedia(this.insertFile));
      this.dropzonePicker.onDrag(this.handleDrag);

      this.binaryPicker.onNewMedia(e => analyticsService.trackEvent('atlassian.editor.media.file.binary', e.fileMimeType ? { fileMimeType: e.fileMimeType } : {}));
      this.popupPicker.onNewMedia(e => analyticsService.trackEvent('atlassian.editor.media.file.popup', e.fileMimeType ? { fileMimeType: e.fileMimeType } : {}));
      this.clipboardPicker.onNewMedia(e => analyticsService.trackEvent('atlassian.editor.media.file.paste', e.fileMimeType ? { fileMimeType: e.fileMimeType } : {}));
      this.dropzonePicker.onNewMedia(e => analyticsService.trackEvent('atlassian.editor.media.file.drop', e.fileMimeType ? { fileMimeType: e.fileMimeType } : {}));
    }

    // set new upload params for the pickers
    pickers.forEach(picker => picker.setUploadParams(uploadParams));
  }

  private collectionFromProvider(): string | undefined {
    return this.mediaProvider && this.mediaProvider.uploadParams && this.mediaProvider.uploadParams.collection;
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
        this.replaceNodeWithPublicId(state.id, state.publicId!);
        break;
    }
  }

  private notifyPluginStateSubscribers = () => {
    this.pluginStateChangeSubscribers.forEach(cb => cb.call(cb, this));
  }

  private removeNodeById = (id: string) => {
    // TODO: we would like better error handling and retry support here.
    const mediaNodeWithPos = this.findMediaNode(id);
    if (mediaNodeWithPos) {
      removeMediaNode(this.view, mediaNodeWithPos.node, mediaNodeWithPos.getPos);
    }
  }

  private replaceNodeWithPublicId = (temporaryId: string, publicId: string) => {
    const { view } = this;
    if (!view) {
      return;
    }

    const mediaNodeWithPos = this.findMediaNode(temporaryId);
    if (!mediaNodeWithPos) {
      return;
    }

    const {
      getPos,
      node: mediaNode,
    } = mediaNodeWithPos;

    const newNode = view.state.schema.nodes.media!.create({
      ...mediaNode.attrs,
      id: publicId,
    });

    // Copy all optional attributes from old node
    copyOptionalMediaAttributes(mediaNode.attrs, newNode.attrs);

    // replace the old node with a new one
    const nodePos = getPos();
    const tr = view.state.tr.replaceWith(nodePos, nodePos + mediaNode.nodeSize, newNode);
    view.dispatch(tr.setMeta('addToHistory', false));
  }

  removeSelectedMediaNode = (): boolean => {
    const { view } = this;
    if (this.isMediaNodeSelection()) {
      const { from, node } = view.state.selection as NodeSelection;
      removeMediaNode(view, node, () => from);
      return true;
    }
    return false;
  }

  private isMediaNodeSelection() {
    const { selection, schema } = this.view.state;
    return selection instanceof NodeSelection && selection.node.type === schema.nodes.media;
  }

  /**
   * Since we replace nodes with public id when node is finalized
   * stateManager contains no information for public ids
   */
  private getMediaNodeStateStatus = (id: string) => {
    const { stateManager } = this;
    const state = stateManager.getState(id);

    return (state && state.status) || 'ready';
  }

  private handleDrag = (dragState: 'enter' | 'leave') => {
    const isActive = dragState === 'enter';
    if (this.showDropzone === isActive) {
      return;
    }
    this.showDropzone = isActive;

    const { dispatch, state } = this.view;
    // Trigger state change to be able to pick it up in the decorations handler
    dispatch(state.tr);
  }
}

export const stateKey = new PluginKey('mediaPlugin');

export const createPlugin = (schema: Schema, options: MediaPluginOptions, dispatch?: Dispatch) => {
  const dropZone = document.createElement('div');
  ReactDOM.render(React.createElement(DropPlaceholder), dropZone);
  return new Plugin({
    state: {
      init(config, state) {
        return new MediaPluginState(state, options);
      },
      apply(tr, pluginState: MediaPluginState, oldState, newState) {
        pluginState.detectLinkRangesInSteps(tr, oldState);

        // Ignore creating link cards during link editing
        const { link } = oldState.schema.marks;
        const { nodeAfter, nodeBefore } = newState.selection.$from;

        if ((nodeAfter && link.isInSet(nodeAfter.marks)) ||
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
      }
    },
    key: stateKey,
    view: (view: EditorView) => {
      const pluginState: MediaPluginState = stateKey.getState(view.state);
      pluginState.setView(view);

      return {
        update: (view: EditorView, prevState: EditorState) => {
          pluginState.insertLinks();
        }
      };
    },
    props: {
      decorations: (state: EditorState) => {
        const pluginState = stateKey.getState(state);
        if (!pluginState.showDropzone) {
          return;
        }

        const { schema, selection: { $anchor } } = state;
        // When a media is already selected
        if (state.selection instanceof NodeSelection) {
          return;
        }

        let pos: number | null | undefined = $anchor.pos;
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
          Decoration.widget(pos, dropZone, { key: 'drop-placeholder' })
        ];
        return DecorationSet.create(state.doc, dropPlaceholders);
      },
      nodeViews: {
        mediaGroup: nodeViewFactory(options.providerFactory, {
          mediaGroup: ReactMediaGroupNode,
          media: ReactMediaNode,
        }, true),
        singleImage: nodeViewFactory(options.providerFactory, {
          singleImage: ReactSingleImageNode,
          media: ReactMediaNode,
        }, true),
      },
      handleTextInput(view: EditorView, from: number, to: number, text: string): boolean {
        const pluginState: MediaPluginState = stateKey.getState(view.state);
        pluginState.splitMediaGroup();
        return false;
      }
    }
  });
};

const plugins = (schema: Schema, options: MediaPluginOptions, dispatch?: Dispatch) => {
  return [createPlugin(schema, options, dispatch), keymapPlugin(schema)].filter((plugin) => !!plugin) as Plugin[];
};

export default plugins;

export interface MediaData {
  id: string;
  type?: MediaType;
}
