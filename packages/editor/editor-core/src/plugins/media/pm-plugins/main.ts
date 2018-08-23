import * as assert from 'assert';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode, Schema, Node } from 'prosemirror-model';
import { insertPoint } from 'prosemirror-transform';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import {
  EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
  Transaction,
} from 'prosemirror-state';
import { Context } from '@atlaskit/media-core';
import { UploadParams } from '@atlaskit/media-picker';
import { MediaType, MediaSingleLayout } from '@atlaskit/editor-common';

import analyticsService from '../../../analytics/service';
import { ErrorReporter, isImage } from '../../../utils';
import { Dispatch } from '../../../event-dispatcher';
import { EditorAppearance } from '../../../types/editor-props';
import DropPlaceholder from '../ui/Media/DropPlaceholder';
import { MediaPluginOptions } from '../media-plugin-options';
import {
  insertLinks,
  URLInfo,
  detectLinkRangesInSteps,
} from '../utils/media-links';
import { insertMediaGroupNode, isNonImagesBanned } from '../utils/media-files';
import { removeMediaNode, splitMediaGroup } from '../utils/media-common';
import PickerFacade, { PickerFacadeConfig } from '../picker-facade';
import pickerFacadeLoader from '../picker-facade-loader';
import {
  MediaState,
  MediaProvider,
  MediaStateStatus,
  MediaStateManager,
} from '../types';
import DefaultMediaStateManager from '../default-state-manager';
import { insertMediaSingleNode } from '../utils/media-single';

import { hasParentNodeOfType } from 'prosemirror-utils';
import { getPosHandler } from '../../../nodeviews/ReactNodeView';
import { FileIdentifier } from '@atlaskit/media-card';
export { DefaultMediaStateManager };
export { MediaState, MediaProvider, MediaStateStatus, MediaStateManager };

// We get `publicId` of `file` in `processing` stage so it's possible to send
// consumers a ADF with media-ids before ready state
const MEDIA_RESOLVED_STATES = ['ready', 'error', 'cancelled', 'processing'];

export type PluginStateChangeSubscriber = (state: MediaPluginState) => any;

export interface MediaNodeWithPosHandler {
  node: PMNode;
  getPos: getPosHandler;
}

export class MediaPluginState {
  public allowsMedia: boolean = false;
  public allowsUploads: boolean = false;
  public allowsLinks: boolean = false;
  public stateManager: MediaStateManager;
  public ignoreLinks: boolean = false;
  public waitForMediaUpload: boolean = true;
  public allUploadsFinished: boolean = true;
  public showDropzone: boolean = false;
  public element?: HTMLElement;
  public layout: MediaSingleLayout = 'center';
  private mediaNodes: MediaNodeWithPosHandler[] = [];
  private pendingTask = Promise.resolve<MediaState | null>(null);
  private options: MediaPluginOptions;
  private view: EditorView;
  private pluginStateChangeSubscribers: PluginStateChangeSubscriber[] = [];
  private useDefaultStateManager = true;
  private destroyed = false;
  private mediaProvider: MediaProvider;
  private errorReporter: ErrorReporter;

  public pickers: PickerFacade[] = [];
  public binaryPicker?: PickerFacade;
  private popupPicker?: PickerFacade;
  private clipboardPicker?: PickerFacade;
  private dropzonePicker?: PickerFacade;
  private customPicker?: PickerFacade;
  public editingMediaId?: string;

  private linkRanges: Array<URLInfo>;
  public editorAppearance: EditorAppearance;
  private removeOnCloseListener: () => void = () => {};

  private reactContext: () => {};

  public resolvedUploadContext: Context | undefined;

  constructor(
    state: EditorState,
    options: MediaPluginOptions,
    reactContext: () => {},
    editorAppearance?: EditorAppearance,
  ) {
    this.reactContext = reactContext;
    this.options = options;
    this.editorAppearance = editorAppearance;
    this.waitForMediaUpload =
      options.waitForMediaUpload === undefined
        ? true
        : options.waitForMediaUpload;

    const { nodes } = state.schema;
    assert(
      nodes.media && (nodes.mediaGroup || nodes.mediaSingle),
      'Editor: unable to init media plugin - media or mediaGroup/mediaSingle node absent in schema',
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
    let Picker: typeof PickerFacade;

    try {
      [resolvedMediaProvider, Picker] = await Promise.all([
        mediaProvider,
        pickerFacadeLoader(),
      ]);

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
        this.initPickers(
          resolvedMediaProvider.uploadParams,
          uploadContext,
          Picker,
          this.reactContext,
        );

        this.resolvedUploadContext = uploadContext;
      } else {
        this.destroyPickers();
      }
    } else {
      this.destroyPickers();
    }

    this.notifyPluginStateSubscribers();
  };

  getMediaOptions = () => this.options;

  updateElement(): void {
    let newElement;
    if (this.selectedMediaNode() && this.isMediaSingle()) {
      newElement = this.getDomElement(this.view.domAtPos.bind(this.view));
    }

    if (this.element !== newElement) {
      this.element = newElement;
      this.notifyPluginStateSubscribers();
    }
  }

  updateUploadStateDebounce: number | null = null;
  updateUploadState(): void {
    if (!this.waitForMediaUpload) {
      return;
    }

    if (this.updateUploadStateDebounce) {
      clearTimeout(this.updateUploadStateDebounce);
    }

    this.updateUploadStateDebounce = setTimeout(() => {
      this.updateUploadStateDebounce = null;
      this.allUploadsFinished = false;
      this.notifyPluginStateSubscribers();
      this.waitForPendingTasks().then(() => {
        this.allUploadsFinished = true;
        this.notifyPluginStateSubscribers();
      });
    }, 0);
  }

  updateLayout(layout: MediaSingleLayout): void {
    this.layout = layout;
    this.notifyPluginStateSubscribers();
  }

  private isMediaSingle(): boolean {
    const { selection, schema } = this.view.state;
    return selection.$from.parent.type === schema.nodes.mediaSingle;
  }

  private getDomElement(domAtPos: EditorView['domAtPos']) {
    const { from } = this.view.state.selection;
    if (this.selectedMediaNode()) {
      const { node } = domAtPos(from);
      if (!node.childNodes.length) {
        return node.parentNode as HTMLElement | undefined;
      }
      return (node as HTMLElement).querySelector('.wrapper');
    }
  }

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

    const imageAttachments = mediaStates.filter(media =>
      isImage(media.fileMimeType),
    );

    let nonImageAttachements = mediaStates.filter(
      media => !isImage(media.fileMimeType),
    );

    const grandParentNode = this.view.state.selection.$from.node(-1);

    // in case of gap cursor, selection might be at depth=0
    if (grandParentNode && isNonImagesBanned(grandParentNode)) {
      nonImageAttachements = [];
    }

    mediaStates.forEach(mediaState =>
      this.stateManager.on(mediaState.id, this.handleMediaState),
    );

    if (this.editorAppearance !== 'message' && mediaSingle) {
      insertMediaGroupNode(this.view, nonImageAttachements, collection);
      imageAttachments.forEach(mediaState => {
        insertMediaSingleNode(this.view, mediaState, collection);
      });
    } else {
      insertMediaGroupNode(this.view, mediaStates, collection);
    }

    const isEndState = (state: MediaState) =>
      state.status && MEDIA_RESOLVED_STATES.indexOf(state.status) !== -1;

    this.pendingTask = mediaStates
      .filter(state => !isEndState(state))
      .reduce((promise, state) => {
        // Chain the previous promise with a new one for this media item
        return new Promise<MediaState | null>((resolve, reject) => {
          const onStateChange = newState => {
            // When media item reaches its final state, remove listener and resolve
            if (isEndState(newState)) {
              stateManager.off(state.id, onStateChange);
              resolve(newState);
            }
          };

          stateManager.on(state.id, onStateChange);
        }).then(() => promise);
      }, this.pendingTask);

    const { view } = this;
    if (!view.hasFocus()) {
      view.focus();
    }
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

    return insertLinks(
      this.view,
      this.stateManager,
      this.handleMediaState,
      this.linkRanges,
      linkCreateContextInstance,
      this.collectionFromProvider(),
    );
  };

  splitMediaGroup = (): boolean => splitMediaGroup(this.view);

  insertFileFromDataUrl = (url: string, fileName: string) => {
    const { binaryPicker } = this;
    assert(
      binaryPicker,
      'Unable to insert file because media pickers have not been initialized yet',
    );

    binaryPicker!.upload(url, fileName);
  };

  // TODO [MSW-454]: remove this logic from Editor
  onPopupPickerClose = () => {
    if (
      this.dropzonePicker &&
      this.popupPicker &&
      this.popupPicker.type === 'popup'
    ) {
      this.dropzonePicker.activate();
    }
  };

  showMediaPicker = () => {
    if (!this.popupPicker) {
      return;
    }
    if (this.dropzonePicker && this.popupPicker.type === 'popup') {
      this.dropzonePicker.deactivate();
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
  handleMediaNodeRemoval = (node: PMNode, getPos: getPosHandler) => {
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
  handleMediaNodeMount = (node: PMNode, getPos: getPosHandler) => {
    this.mediaNodes.push({ node, getPos });
  };

  /**
   * Called from React UI Component on componentWillUnmount and componentWillReceiveProps
   * when React component's underlying node property is replaced with a new node
   */
  handleMediaNodeUnmount = (oldNode: PMNode) => {
    this.mediaNodes = this.mediaNodes.filter(
      ({ node }) => oldNode.attrs.__key !== node.attrs.__key,
    );
  };

  edit = () => {
    const selected = this.selectedMediaNode();
    if (!selected) {
      return;
    }

    this.editingMediaId = selected.attrs.__key;

    // triggers contentComponent render
    this.view.dispatch(this.view.state.tr.setMeta(stateKey, 'edit'));
  };

  onFinishEditing = (newId: FileIdentifier, oldNode: Node) => {
    const oldId = this.editingMediaId;
    if (!oldId) {
      console.warn('no old id');
      return;
    }

    const mediaNodeWithPos = this.findMediaNode(oldId);
    if (!mediaNodeWithPos) {
      console.warn('no media node with id', oldId);
      return;
    }

    console.log('new id', newId);

    const { getPos, node: mediaNode } = mediaNodeWithPos;

    console.log('old node', mediaNode);

    const newNode = this.view.state.schema.nodes.media!.create({
      ...oldNode.attrs,
      id: newId.id,
      // __key: newId.id,
      // width: mediaNode.attrs.width,
      // height: mediaNode.attrs.height,
    });

    console.log('new node', newNode);

    const nodePos = getPos();
    const tr = this.view.state.tr.replaceWith(
      nodePos,
      nodePos + mediaNode.nodeSize,
      newNode,
    );

    console.log('tr', tr);

    this.view.dispatch(
      tr.setMeta('addToHistory', false).setMeta(stateKey, 'noedit'),
    );

    this.editingMediaId = undefined;
  };

  align = (layout: MediaSingleLayout): boolean => {
    if (!this.selectedMediaNode()) {
      return false;
    }

    const {
      selection: { from },
      schema,
      tr,
    } = this.view.state;

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

    this.removeOnCloseListener();
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
        console.log(
          '\tlooking for node with id',
          id,
          'have id',
          node.attrs.id,
          '__key',
          node.attrs.__key,
        );
        if (node.attrs.__key === id) {
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
    this.clipboardPicker = undefined;
    this.dropzonePicker = undefined;
    this.customPicker = undefined;
  };

  private initPickers(
    uploadParams: UploadParams,
    context: Context,
    Picker: typeof PickerFacade,
    reactContext: () => {},
  ) {
    if (this.destroyed) {
      return;
    }
    const { errorReporter, pickers, stateManager } = this;
    // create pickers if they don't exist, re-use otherwise
    if (!pickers.length) {
      const pickerFacadeConfig: PickerFacadeConfig = {
        context,
        stateManager,
        errorReporter,
      };
      const { featureFlags } = this.mediaProvider;
      const defaultPickerConfig = {
        useNewUploadService: !!(
          featureFlags && featureFlags.useNewUploadService
        ),
        uploadParams,
        proxyReactContext: reactContext(),
      };

      if (this.options.customMediaPicker) {
        pickers.push(
          (this.customPicker = new Picker(
            'customMediaPicker',
            pickerFacadeConfig,
            this.options.customMediaPicker,
          )),
        );
      } else {
        if (context.config.userAuthProvider) {
          pickers.push(
            (this.popupPicker = new Picker('popup', pickerFacadeConfig, {
              userAuthProvider: context.config.userAuthProvider,
              ...defaultPickerConfig,
            })),
          );
        } else {
          pickers.push(
            (this.popupPicker = new Picker(
              'browser',
              pickerFacadeConfig,
              defaultPickerConfig,
            )),
          );
        }

        pickers.push(
          (this.binaryPicker = new Picker(
            'binary',
            pickerFacadeConfig,
            defaultPickerConfig,
          )),
        );

        pickers.push(
          (this.clipboardPicker = new Picker(
            'clipboard',
            pickerFacadeConfig,
            defaultPickerConfig,
          )),
        );

        pickers.push(
          (this.dropzonePicker = new Picker('dropzone', pickerFacadeConfig, {
            container: this.options.customDropzoneContainer,
            headless: true,
            ...defaultPickerConfig,
          })),
        );

        this.dropzonePicker.onDrag(this.handleDrag);
        this.removeOnCloseListener = this.popupPicker.onClose(
          this.onPopupPickerClose,
        );
      }

      pickers.forEach(picker => {
        picker.onNewMedia(this.insertFiles);
        picker.onNewMedia(this.trackNewMediaEvent(picker.type));
      });
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

  // upload from cloud picker:
  //  preview -> processing -> ready
  // upload from drag-drop:
  //  uploading -> preview -> uploading -> processing -> ready
  private handleMediaState = async (state: MediaState) => {
    console.log('new media state', state.status, state);
    switch (state.status) {
      case 'error':
        this.removeNodeById(state.id);
        const { uploadErrorHandler } = this.options;

        if (uploadErrorHandler) {
          uploadErrorHandler(state);
        }
        break;

      case 'preview':
        this.updateNodeAttrs(state);
        if (state.ready) {
          this.stateManager.off(state.id, this.handleMediaState);
        }
        break;

      case 'processing':
        if (state.thumbnail && state.publicId) {
          const viewContext = await this.mediaProvider.viewContext;
          // This allows Cards to use local preview while they fetch the remote one
          viewContext.setLocalPreview(state.publicId, state.thumbnail.src);
        }
        if (state.publicId) {
          this.updateNodeAttrs(state);
        }
        break;

      case 'ready':
        if (state.publicId && this.nodeHasNoPublicId(state)) {
          this.updateNodeAttrs(state);
        }
        if (state.preview) {
          this.stateManager.off(state.id, this.handleMediaState);
        }
        break;
    }
  };

  private notifyPluginStateSubscribers = () => {
    this.pluginStateChangeSubscribers.forEach(cb => cb.call(cb, this));
  };

  nodeHasNoPublicId = (state: MediaState) => {
    const { id } = state;
    const mediaNodeWithPos = this.findMediaNode(id);
    if (!mediaNodeWithPos) {
      return;
    }
    const {
      node: {
        attrs: { id: mediaNodeId },
      },
    } = mediaNodeWithPos;
    return mediaNodeId.match(/^temporary:/);
  };

  removeNodeById = (id: string) => {
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

  private updateNodeAttrs = (state: MediaState) => {
    const { view } = this;
    if (!view) {
      console.error('no view');
      return;
    }
    const { id, thumbnail, fileName, fileSize, publicId, fileMimeType } = state;
    const mediaNodeWithPos = this.findMediaNode(id);
    if (!mediaNodeWithPos) {
      console.warn('could not find media node with id', id);
      return;
    }
    const { width, height } = (thumbnail && thumbnail.dimensions) || {
      width: mediaNodeWithPos.node.attrs.width,
      height: mediaNodeWithPos.node.attrs.height,
    };
    const { getPos, node: mediaNode } = mediaNodeWithPos;
    const attrs = {
      ...mediaNode.attrs,
      id: publicId || id,
      width: width,
      height: height,
      __fileName: fileName,
      __fileSize: fileSize,
      __fileMimeType: fileMimeType,
    };

    console.log(
      'setting attributes on',
      mediaNode,
      'to',
      attrs,
      'at pos',
      getPos(),
    );

    // replace the old node with a new one
    const nodePos = getPos();
    if (typeof nodePos === 'undefined') {
      console.warn('no nodepos!');
      return;
    }

    const tr = view.state.tr.setNodeMarkup(nodePos, undefined, attrs);
    view.dispatch(tr.setMeta('addToHistory', false));
  };

  removeSelectedMediaNode = (): boolean => {
    const { view } = this;
    if (this.selectedMediaNode()) {
      const { from, node } = view.state.selection as NodeSelection;
      removeMediaNode(view, node, () => from);
      return true;
    }
    return false;
  };

  selectedMediaNode(): Node | undefined {
    const { selection, schema } = this.view.state;
    if (
      selection instanceof NodeSelection &&
      selection.node.type === schema.nodes.media
    ) {
      const node = selection.node;
      return node;
    }
  }

  isLayoutSupported(): boolean {
    const { selection, schema } = this.view.state;
    if (
      selection instanceof NodeSelection &&
      selection.node.type === schema.nodes.media
    ) {
      return (
        !hasParentNodeOfType(schema.nodes.bodiedExtension)(selection) &&
        !hasParentNodeOfType(schema.nodes.layoutSection)(selection)
      );
    }
    return false;
  }

  /**
   * Since we replace nodes with public id when node is finalized
   * stateManager contains no information for public ids
   */
  private getMediaNodeStateStatus = (id: string) => {
    const state = this.getMediaNodeState(id);
    return (state && state.status) || 'ready';
  };

  getMediaNodeState = (id: string) => {
    return this.stateManager.getState(id);
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
  reactContext: () => {},
  dispatch?: Dispatch,
  editorAppearance?: EditorAppearance,
) => {
  const dropPlaceholder = createDropPlaceholder(editorAppearance);

  return new Plugin({
    state: {
      init(config, state) {
        return new MediaPluginState(
          state,
          options,
          reactContext,
          editorAppearance,
        );
      },
      apply(tr, pluginState: MediaPluginState, oldState, newState) {
        pluginState.detectLinkRangesInSteps(tr, oldState);

        // Ignore creating link cards during link editing
        const { link } = oldState.schema.marks;
        const { nodeAfter, nodeBefore, parent } = newState.selection.$from;

        if (
          (nodeAfter && link.isInSet(nodeAfter.marks)) ||
          (nodeBefore && link.isInSet(nodeBefore.marks))
        ) {
          pluginState.ignoreLinks = true;
        }

        // Update Layout
        const { mediaSingle } = oldState.schema.nodes;
        if (parent.type === mediaSingle) {
          pluginState.layout = parent.attrs.layout;
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
      pluginState.updateElement();

      return {
        update: () => {
          pluginState.updateUploadState();
          pluginState.insertLinks();
          pluginState.updateElement();
        },
      };
    },
    props: {
      decorations: state => {
        const pluginState = getMediaPluginState(state);
        if (!pluginState.showDropzone) {
          return;
        }

        const {
          schema,
          selection: { $anchor },
        } = state;
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
      nodeViews: options.nodeViews,
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

export interface MediaData {
  id: string;
  type?: MediaType;
}
