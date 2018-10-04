import { EditorState, Plugin, PluginKey } from 'prosemirror-state';

import { isPastedFile } from '../../../utils/clipboard';
import { isDroppedFile } from '../../../utils/drag-drop';
import { analyticsService } from '../../../analytics';

import { canInsertMedia, isMediaSelected } from '../utils';
import { ImageUploadHandler, ImageUploadState } from '../types';
import { EditorView } from 'prosemirror-view';
import { startImageUpload, insertExternalImage } from './commands';

type DOMHandlerPredicate = ((e: Event) => boolean);
const createDOMHandler = (pred: DOMHandlerPredicate, eventName: string) => (
  view: EditorView,
  event: Event,
) => {
  if (!pred(event)) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();

  if (startImageUpload(event)(view.state, view.dispatch)) {
    analyticsService.trackEvent(eventName);
  }

  return true;
};

export const stateKey = new PluginKey('imageUploadPlugin');

export const createPlugin = ({ dispatch, providerFactory }) => {
  let uploadHandler: ImageUploadHandler | undefined;

  return new Plugin({
    state: {
      init(config, state: EditorState): ImageUploadState {
        return {
          active: false,
          enabled: canInsertMedia(state),
          hidden: !state.schema.nodes.media || !state.schema.nodes.mediaSingle,
        };
      },
      apply(tr, pluginState: ImageUploadState, oldState, newState) {
        const newActive = isMediaSelected(newState);
        const newEnabled = canInsertMedia(newState);

        const meta = tr.getMeta(stateKey);
        const haveActiveUpload =
          meta && meta.name && meta.name === 'START_UPLOAD';
        const currentActiveUpload = pluginState.activeUpload;

        if (
          newActive !== pluginState.active ||
          newEnabled !== pluginState.enabled ||
          haveActiveUpload !== currentActiveUpload
        ) {
          const newPluginState = {
            ...pluginState,
            active: newActive,
            enabled: newEnabled,
          };

          if (haveActiveUpload) {
            newPluginState.activeUpload = {
              event: meta.event,
            };
          }

          dispatch(newPluginState);
          return newPluginState;
        }

        return pluginState;
      },
    },
    key: stateKey,
    view: () => {
      const handleProvider = async (
        name: string,
        provider?: Promise<ImageUploadHandler>,
      ) => {
        if (name !== 'imageUploadProvider' || !provider) {
          return;
        }

        try {
          uploadHandler = await provider;
        } catch (e) {
          uploadHandler = undefined;
        }
      };

      providerFactory.subscribe('imageUploadProvider', handleProvider);

      return {
        update(view, prevState) {
          const { state: editorState } = view;
          const currentState: ImageUploadState = stateKey.getState(
            editorState,
          )!;

          // if we've add a new upload to the state, execute the uploadHandler
          const oldState: ImageUploadState = stateKey.getState(prevState)!;
          if (
            currentState.activeUpload !== oldState.activeUpload &&
            currentState.activeUpload &&
            uploadHandler
          ) {
            uploadHandler(currentState.activeUpload.event, options =>
              insertExternalImage(options)(view.state, view.dispatch),
            );
          }
        },

        destroy() {
          providerFactory.unsubscribe('imageUploadProvider', handleProvider);
        },
      };
    },
    props: {
      handleDOMEvents: {
        drop: createDOMHandler(isDroppedFile, 'atlassian.editor.image.drop'),
        paste: createDOMHandler(isPastedFile, 'atlassian.editor.image.paste'),
      },
    },
  });
};
