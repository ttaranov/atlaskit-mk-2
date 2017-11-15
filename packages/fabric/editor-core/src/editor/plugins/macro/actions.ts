import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider, MacroADF } from './types';
import { pluginKey } from './plugin';
import * as assert from 'assert';

export const insertMacroFromMacroBrowser = async (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  macroProvider: MacroProvider,
  macroNode?: PmNode,
) => {
  if (!macroProvider) {
    return;
  }

  const newMacro: MacroADF = await macroProvider.openMacroBrowser(macroNode);
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

export const setMacroProvider = async (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  provider: Promise<MacroProvider>,
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

export const setMacroElement = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  macroElement: HTMLElement | null,
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
