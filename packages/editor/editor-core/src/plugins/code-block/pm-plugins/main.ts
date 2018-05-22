import { Node } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import codeBlockNodeView from '../nodeviews/code-block';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Dispatch } from '../../../event-dispatcher';

export type ToolbarStatus = 'FOCUS' | 'BLUR';
export type ActiveCodeBlock = { node: Node; pos: number };
export interface CodeBlockState {
  isEditorFocused: boolean;
  activeCodeBlock?: ActiveCodeBlock;
}

const adjustPositionFix = (activeCodeBlock?: ActiveCodeBlock) =>
  activeCodeBlock
    ? {
        node: activeCodeBlock.node,
        pos: activeCodeBlock.pos - 1,
      }
    : undefined;

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
        return setActiveCodeBlock(
          { isEditorFocused: true },
          adjustPositionFix(activeCodeBlock),
        );
      },
      apply(
        tr,
        pluginState: CodeBlockState,
        oldState,
        newState,
      ): CodeBlockState {
        const nextToolbarStatus = tr.getMeta(stateKey) as ToolbarStatus;
        let state: CodeBlockState = pluginState;
        if (nextToolbarStatus) {
          state = {
            ...pluginState,
            isEditorFocused: nextToolbarStatus === 'FOCUS',
          };
        } else if (!oldState.selection.eq(tr.selection)) {
          let activeCodeBlock = findParentNodeOfType(
            tr.doc.type.schema.nodes.codeBlock,
          )(tr.selection);
          state = setActiveCodeBlock(
            pluginState,
            adjustPositionFix(activeCodeBlock),
          );
        } else if (tr.docChanged && pluginState.activeCodeBlock) {
          const { activeCodeBlock: { pos, node } } = pluginState;
          const trPos = tr.mapping.map(pos);
          const trNode = tr.doc.nodeAt(trPos);
          // Update activeCodeBlock when node updated or deleted
          if (trNode && trNode !== node && trNode.type === node.type) {
            state = setActiveCodeBlock(pluginState, {
              pos: trPos,
              node: trNode,
            });
          } else {
            state = { isEditorFocused: pluginState.isEditorFocused };
          }
        }
        dispatch(stateKey, state);
        return state;
      },
    },
    key: stateKey,
    props: {
      nodeViews: {
        codeBlock: codeBlockNodeView,
      },
      handleDOMEvents: {
        click: (view, event) => {
          const pluginState: CodeBlockState = stateKey.getState(view.state);
          if (!pluginState.isEditorFocused) {
            const focusType = view.hasFocus() ? 'FOCUS' : 'BLUR';
            view.dispatch(view.state.tr.setMeta(stateKey, focusType));
          }
          return false;
        },
        focus: (view, event) => {
          const pluginState: CodeBlockState = stateKey.getState(view.state);
          if (!pluginState.isEditorFocused) {
            view.dispatch(view.state.tr.setMeta(stateKey, 'FOCUS'));
          }
          return false;
        },
        blur: (view, event: FocusEvent) => {
          const pluginState: CodeBlockState = stateKey.getState(view.state);
          if (pluginState.isEditorFocused) {
            view.dispatch(view.state.tr.setMeta(stateKey, 'BLUR'));
          }
          return false;
        },
      },
    },
  });
