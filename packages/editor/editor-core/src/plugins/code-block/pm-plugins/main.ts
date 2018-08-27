import { Node } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import codeBlockNodeView from '../nodeviews/code-block';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Dispatch } from '../../../event-dispatcher';

export type ActiveCodeBlock = { node: Node; pos: number } | undefined;

export const stateKey = new PluginKey('codeBlockPlugin');

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(_, state: EditorState): ActiveCodeBlock {
        return findParentNodeOfType(state.schema.nodes.codeBlock)(
          state.selection,
        );
      },
      apply(tr, pluginState: ActiveCodeBlock): ActiveCodeBlock {
        let state: ActiveCodeBlock = pluginState;
        if (tr.docChanged && !tr.selectionSet && pluginState) {
          const { pos, deleted } = tr.mapping.mapResult(pluginState.pos);
          if (deleted) {
            state = undefined;
          } else {
            state = { pos, node: tr.doc.nodeAt(pos) as Node };
          }
        } else if (tr.docChanged || tr.selectionSet) {
          state = findParentNodeOfType(tr.doc.type.schema.nodes.codeBlock)(
            tr.selection,
          );
        }
        if (state !== pluginState) {
          dispatch(stateKey, state);
        }
        return state;
      },
    },
    key: stateKey,
    props: {
      nodeViews: {
        codeBlock: codeBlockNodeView,
      },
    },
  });
