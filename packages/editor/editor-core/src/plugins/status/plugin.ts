import { EditorState, Plugin, PluginKey, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import StatusNodeView from './nodeviews/status';
import { ReactNodeView } from '../../nodeviews';
import { PMPluginFactory } from '../../types';

export const pluginKey = new PluginKey('statusPlugin');

export type StatusState = {
  autoFocus: boolean;
  showStatusPickerAt: number | null;
  selectionChanges: SelectionChange;
};

export type SelectionChangeHandler = (
  newSelection: Selection,
  prevSelection: Selection,
) => any;

export class SelectionChange {
  private changeHandlers: SelectionChangeHandler[] = [];

  constructor() {
    this.changeHandlers = [];
  }

  subscribe(cb: SelectionChangeHandler) {
    this.changeHandlers.push(cb);
  }

  unsubscribe(cb: SelectionChangeHandler) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  notifyNewSelection(newSelection: Selection, prevSelection: Selection) {
    this.changeHandlers.forEach(cb => cb(newSelection, prevSelection));
  }
}

const createPlugin: PMPluginFactory = ({ dispatch, portalProviderAPI }) =>
  new Plugin({
    state: {
      init: () => ({
        autoFocus: false,
        selectionChanges: new SelectionChange(),
        showStatusPickerAt: null,
      }),
      apply(tr, state: StatusState) {
        const meta = tr.getMeta(pluginKey);

        if (meta) {
          let newState = { ...state, ...meta };
          dispatch(pluginKey, newState);
          return newState;
        }

        if (tr.docChanged && state.showStatusPickerAt) {
          const { pos, deleted } = tr.mapping.mapResult(
            state.showStatusPickerAt,
          );
          const newState = {
            showStatusPickerAt: deleted ? null : pos,
          };

          if (newState.showStatusPickerAt !== state.showStatusPickerAt) {
            dispatch(pluginKey, newState);

            return newState;
          }
        }

        return state;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        status: ReactNodeView.fromComponent(StatusNodeView, portalProviderAPI),
      },
    },
    view: (view: EditorView) => {
      return {
        update: (view: EditorView, prevState: EditorState) => {
          const newSelection = view.state.selection;
          const prevSelection = prevState.selection;
          if (!prevSelection.eq(newSelection)) {
            // selection changed
            const pluginState: StatusState = pluginKey.getState(view.state);
            const { selectionChanges } = pluginState;
            if (selectionChanges) {
              selectionChanges.notifyNewSelection(newSelection, prevSelection);
            }
          }
        },
      };
    },
  });

export default createPlugin;
