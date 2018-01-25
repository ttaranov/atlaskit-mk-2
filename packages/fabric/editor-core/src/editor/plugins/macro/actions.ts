import { EditorState, Transaction } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider, MacroAttributes } from './types';
import { pluginKey } from './';
import * as assert from 'assert';
import { getValidNode } from '@atlaskit/editor-common';

export const insertMacroFromMacroBrowser = (
  macroProvider: MacroProvider,
  macroNode?: PmNode,
) => async (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  tr?: Transaction,
): Promise<boolean> => {
  if (!macroProvider) {
    return false;
  }

  // opens MacroBrowser for editing "macroNode" if passed in
  const newMacro: MacroAttributes = await macroProvider.openMacroBrowser(
    macroNode,
  );
  if (newMacro) {
    const node = resolveMacro(newMacro, state);

    if (node) {
      dispatch((tr || state.tr).replaceSelectionWith(node).scrollIntoView());
    }
    return true;
  }

  return false;
};

export const resolveMacro = (
  macro?: MacroAttributes,
  state?: EditorState,
): PmNode | null => {
  if (!macro || !state) {
    return null;
  }

  const { schema } = state;
  const { type, attrs } = getValidNode(macro, schema);
  let node;

  if (type === 'extension') {
    node = schema.nodes.extension.create(attrs);
  } else if (type === 'bodiedExtension') {
    node = schema.nodes.bodiedExtension.create(
      attrs,
      schema.nodeFromJSON(macro).content,
    );
  } else if (type === 'inlineExtension') {
    node = schema.nodes.inlineExtension.create(attrs);
  }

  return node;
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
      `MacroProvider promise did not resolve to a valid instance of MacroProvider - ${resolvedProvider}`,
    );
  } catch (err) {
    resolvedProvider = null;
  }
  dispatch(state.tr.setMeta(pluginKey, { macroProvider: resolvedProvider }));
  return true;
};
