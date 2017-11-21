import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider, MacroAdf } from './types';
import { pluginKey } from './plugin';
import * as assert from 'assert';

export const insertMacroFromMacroBrowser = (
  macroProvider: MacroProvider,
  macroNode?: PmNode,
) => async (state: EditorState, dispatch: (tr: Transaction) => void) => {
  if (!macroProvider) {
    return;
  }

  const newMacro: MacroAdf = await macroProvider.openMacroBrowser(macroNode);
  if (newMacro) {
    const { tr, schema } = state;
    const { type, attrs } = newMacro;
    let node;

    if (type === 'inlineExtension') {
      node = schema.nodes.inlineExtension.create(attrs);
    }

    if (node) {
      dispatch(tr.replaceSelectionWith(node).scrollIntoView());
    }
  }
};

export const setMacroProvider = (provider: Promise<MacroProvider>) => async (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  let resolvedProvider: MacroProvider | null;
  try {
    resolvedProvider = await provider;
    assert(
      resolvedProvider && resolvedProvider.openMacroBrowser,
      `MacroProvider promise did not resolve to a valid instance of MacroProvider - ${
        resolvedProvider
      }`,
    );
  } catch (err) {
    resolvedProvider = null;
  }
  dispatch(state.tr.setMeta(pluginKey, { macroProvider: resolvedProvider }));
};

export const setMacroElement = (macroElement: HTMLElement | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  dispatch(state.tr.setMeta(pluginKey, { macroElement }));
};

export const removeMacro = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  const { tr, selection: { $from, $to } } = state;
  dispatch(
    tr.delete($from.pos, $to.pos).setMeta(pluginKey, { macroElement: null }),
  );
};
