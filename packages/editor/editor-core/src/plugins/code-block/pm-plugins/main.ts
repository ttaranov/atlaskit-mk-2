import { Node } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import codeBlockNodeView from '../nodeviews/code-block';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Dispatch } from '../../../event-dispatcher';

export type ActiveCodeBlock = { node: Node; pos: number };
export interface CodeBlockState {
  activeCodeBlock?: ActiveCodeBlock;
}

const setActiveCodeBlock = (
  state: CodeBlockState,
  activeCodeBlock?: ActiveCodeBlock,
) => ({
  ...state,
  activeCodeBlock: activeCodeBlock,
});

export const stateKey = new PluginKey('codeBlockPlugin');

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(config, state: EditorState): CodeBlockState {
        const activeCodeBlock = findParentNodeOfType(
          state.schema.nodes.codeBlock,
        )(state.selection);
        return setActiveCodeBlock({}, activeCodeBlock);
      },
      apply(
        tr,
        pluginState: CodeBlockState,
        oldState,
        newState,
      ): CodeBlockState {
        let state: CodeBlockState = pluginState;
        if (!oldState.selection.eq(tr.selection)) {
          let activeCodeBlock = findParentNodeOfType(
            tr.doc.type.schema.nodes.codeBlock,
          )(tr.selection);
          state = setActiveCodeBlock(pluginState, activeCodeBlock);
        } else if (tr.docChanged && pluginState.activeCodeBlock) {
          const {
            activeCodeBlock: { pos, node },
          } = pluginState;
          const trPos = tr.mapping.map(pos);
          const trNode = tr.doc.nodeAt(trPos);
          // Update activeCodeBlock when node updated or deleted
          if (trNode && trNode !== node && trNode.type === node.type) {
            state = setActiveCodeBlock(pluginState, {
              pos: trPos,
              node: trNode,
            });
          } else {
            state = {};
          }
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
