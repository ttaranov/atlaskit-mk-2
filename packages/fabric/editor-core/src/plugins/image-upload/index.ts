import { Schema } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsService } from '../../analytics';
import { ProviderFactory } from '@atlaskit/editor-common';
import inputRulePlugin from './input-rule';
import { isPastedFile } from '../../utils/clipboard';

export type StateChangeHandler = (state: ImageUploadState) => any;
export interface ImageUploadPluginOptions {
  defaultHandlersEnabled?: boolean;
  supportedImageTypes?: string[];
  maxFileSizeInBytes?: number;
  providerFactory?: ProviderFactory;
}

export type ImageUploadHandler = (e: any, insertImageFn: any) => void;

const DEFAULT_OPTIONS: ImageUploadPluginOptions = {
  maxFileSizeInBytes: 10000000,
  supportedImageTypes: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
};

function isDroppedFile(e: DragEvent): boolean {
  return (
    Array.prototype.slice.call(e.dataTransfer.types).indexOf('Files') !== -1
  );
}

export class ImageUploadState {
  active = false;
  enabled = false;
  hidden = false;
  src?: string = undefined;
  element?: HTMLElement = undefined;
  changeHandlers: StateChangeHandler[] = [];

  private state: EditorState;
  private config: ImageUploadPluginOptions;
  private uploadHandler?: ImageUploadHandler;

  constructor(state: EditorState, options?: ImageUploadPluginOptions) {
    this.changeHandlers = [];
    this.state = state;
    this.config = { ...DEFAULT_OPTIONS, ...options };
    this.hidden = !state.schema.nodes.image;
    this.enabled = this.canInsertImage();
    if (options && options.providerFactory) {
      options.providerFactory.subscribe(
        'imageUploadProvider',
        this.handleProvider,
      );
    }
  }

  handleProvider = async (
    name: string,
    provider?: Promise<ImageUploadHandler>,
  ) => {
    if (provider) {
      try {
        this.uploadHandler = await provider;
      } catch (e) {
        this.uploadHandler = undefined;
      }
    } else {
      this.uploadHandler = undefined;
    }
  };

  subscribe(cb: StateChangeHandler) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: StateChangeHandler) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  // TODO: Fix types (ED-2987)
  update(state: EditorState, docView: any, dirty = false): void {
    this.state = state;
    const newActive = this.isImageSelected();
    if (newActive !== this.active) {
      this.active = newActive;
      dirty = true;
    }

    const newEnabled = this.canInsertImage();
    if (newEnabled !== this.enabled) {
      this.enabled = newEnabled;
      dirty = true;
    }

    const newElement = newActive
      ? this.getActiveImageElement(docView)
      : undefined;
    if (newElement !== this.element) {
      this.element = newElement;
      dirty = true;
    }

    if (dirty) {
      this.changeHandlers.forEach(cb => cb(this));
    }
  }

  handleImageUpload(view: EditorView, event?: Event): boolean {
    const { uploadHandler } = this;

    if (!uploadHandler) {
      return false;
    }

    uploadHandler(event, this.addImage(view));

    return true;
  }

  addImage(view: EditorView): Function {
    return (options: { src?: string; alt?: string; title?: string }): void => {
      const { state } = this;
      const { image } = state.schema.nodes;
      if (this.enabled && image) {
        view.dispatch(
          state.tr.insert(state.selection.$to.pos, image.create(options)),
        );
      }
    };
  }

  updateImage(view: EditorView): Function {
    return (options: { src?: string; alt?: string; title?: string }): void => {
      if (this.isImageSelected()) {
        this.removeImage(view);
        this.addImage(view)(options);
      }
    };
  }

  removeImage(view: EditorView): void {
    const { state } = this;
    const { $from, $to } = state.selection;

    if (this.isImageSelected()) {
      view.dispatch(state.tr.delete($from.pos, $to.pos));
    }
  }

  // TODO: Fix types (ED-2987)
  private getActiveImageElement(docView: any): HTMLElement {
    const { $from } = this.state.selection;
    const { node, offset } = docView.domFromPos($from.pos);

    if (node.childNodes.length === 0) {
      return node.parentElement!;
    }

    return node.childNodes[offset] as HTMLElement;
  }

  private canInsertImage(): boolean {
    const { state } = this;
    const { image } = state.schema.nodes;
    const { $to } = state.selection;

    if (image) {
      for (let d = $to.depth; d >= 0; d--) {
        let index = $to.index(d);
        if ($to.node(d).canReplaceWith(index, index, image)) {
          return true;
        }
      }
    }
    return false;
  }

  private isImageSelected(): boolean {
    const { selection } = this.state;
    return (
      selection instanceof NodeSelection &&
      selection.node.type === this.state.schema.nodes.image
    );
  }
}

export const stateKey = new PluginKey('imageUploadPlugin');

export const createPlugin = (
  schema: Schema,
  options: ImageUploadPluginOptions,
) =>
  new Plugin({
    state: {
      init(config, state: EditorState) {
        return new ImageUploadState(state, options);
      },
      apply(tr, pluginState: ImageUploadState, oldState, newState) {
        return pluginState;
      },
    },
    key: stateKey,
    view: (view: EditorView & { docView?: any }) => {
      const pluginState: ImageUploadState = stateKey.getState(view.state);
      pluginState.update(view.state, view.docView, true);

      return {
        update: (
          view: EditorView & { docView?: any },
          prevState: EditorState,
        ) => {
          pluginState.update(view.state, view.docView);
        },
        destroy() {
          if (options && options.providerFactory) {
            options.providerFactory.unsubscribe(
              'imageUploadProvider',
              pluginState.handleProvider,
            );
          }
        },
      };
    },
    props: {
      handleDOMEvents: {
        drop(view: EditorView, event: DragEvent) {
          const pluginState: ImageUploadState = stateKey.getState(view.state);
          if (!isDroppedFile(event) || !pluginState.enabled) {
            return false;
          }
          analyticsService.trackEvent('atlassian.editor.image.drop');

          event.preventDefault();
          event.stopPropagation();

          pluginState.handleImageUpload(view, event);
          return true;
        },
        paste(view: EditorView, event: ClipboardEvent) {
          const pluginState: ImageUploadState = stateKey.getState(view.state);
          if (!isPastedFile(event) || !pluginState.enabled) {
            return false;
          }
          analyticsService.trackEvent('atlassian.editor.image.paste');

          event.preventDefault();
          event.stopPropagation();

          pluginState.handleImageUpload(view, event);
          return true;
        },
      },
    },
  });

const plugins = (schema: Schema, providerFactory?: ProviderFactory) => {
  return [
    createPlugin(schema, { providerFactory }),
    inputRulePlugin(schema),
  ].filter(plugin => !!plugin) as Plugin[];
};

export default plugins;
