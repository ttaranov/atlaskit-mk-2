import { Plugin } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import { EditorPlugin } from '../../types';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { uuid } from '../../utils/input-rules';

export const stateKey = new PluginKey('inlineCommentPlugin');

type InlineCommentLocation = {
  conversationId: string;
  from: number;
  to: number;
};

export const createPlugin = () =>
  new Plugin({
    key: stateKey,
    state: {
      init() {
        return [];
      },
      apply(tr, oldPluginState): InlineCommentLocation[] {
        if (tr.getMeta('icomment')) {
          return [
            ...oldPluginState,
            {
              conversationId: uuid(),
              from: tr.selection.from,
              to: tr.selection.to,
            },
          ];
        } else if (oldPluginState) {
          return oldPluginState
            .filter(
              (icomment: InlineCommentLocation) =>
                !tr.mapping.mapResult(icomment.from).deleted,
            )
            .map(icomment => ({
              ...icomment,
              from: tr.mapping.map(icomment.from),
              to: tr.mapping.map(icomment.to, -1),
            }));
        }
        return [];
      },
    },
    props: {
      decorations(state) {
        const icomments = stateKey.getState(state);
        if (icomments) {
          const decorations = icomments.map(icomment =>
            Decoration.inline(icomment.from, icomment.to, {
              style: 'background-color: hotpink;',
            }),
          );
          return DecorationSet.create(state.doc, decorations);
        }
      },
      handleKeyDown: keydownHandler({
        'Mod-/': (state, dispatch) => {
          dispatch(state.tr.setMeta('icomment', true));
        },
      }),
    },
  });

const inlineCommentPlugin: EditorPlugin = {
  pmPlugins() {
    return [{ rank: 100, plugin: () => createPlugin() }];
  },
};

export default inlineCommentPlugin;
