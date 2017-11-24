import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider, MacroAdf } from './types';
import { pluginKey } from './';
import * as assert from 'assert';
import { getExtensionRange, isCursorInsideNode } from '../extension/utils';

export const insertMacroFromMacroBrowser = (
  macroProvider: MacroProvider,
  macroNode?: PmNode,
) => async (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): Promise<boolean> => {
  if (!macroProvider) {
    return false;
  }

  // opens MacroBrowser for editing "macroNode" if passed in
  const newMacro: MacroAdf = await macroProvider.openMacroBrowser(macroNode);
  if (newMacro) {
    const { schema } = state;
    const { type, attrs } = newMacro;
    let { tr } = state;
    let node;

    if (type === 'extension') {
      node = schema.nodes.extension.create(
        attrs,
        schema.nodeFromJSON(newMacro).content,
      );
    } else if (type === 'inlineExtension') {
      node = schema.nodes.inlineExtension.create(attrs);
    }
    if (node) {
      if (isCursorInsideNode(state, schema.nodes.extension)) {
        const range = getExtensionRange(state);
        tr = tr.setSelection(
          NodeSelection.create(state.doc, range.$from.pos - 1),
        );
      }
      dispatch(tr.replaceSelectionWith(node).scrollIntoView());
    }
    return true;
  }

  return false;
};

export const setMacroProvider = (provider: Promise<MacroProvider>) => async (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): Promise<boolean> => {
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
  return true;
};
