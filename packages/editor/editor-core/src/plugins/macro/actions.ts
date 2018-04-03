import { EditorState, NodeSelection } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ExtensionProvider, ExtensionAttributes } from './types';
import { pluginKey } from './';
import * as assert from 'assert';
import { getValidNode } from '@atlaskit/editor-common';
import { safeInsert, replaceSelectedNode } from 'prosemirror-utils';

export const insertMacroFromMacroBrowser = (
  extensionProvider: ExtensionProvider,
  macroNode?: PmNode,
) => async (view: EditorView): Promise<boolean> => {
  if (!extensionProvider) {
    return false;
  }
  // opens MacroBrowser for editing "macroNode" if passed in
  const newMacro: ExtensionAttributes = await extensionProvider.openMacroBrowser(
    macroNode,
  );
  if (newMacro) {
    const node = resolveMacro(newMacro, view.state);
    const { schema: { nodes: { bodiedExtension } } } = view.state;
    let { tr } = view.state;
    if (node) {
      if (
        tr.selection instanceof NodeSelection &&
        node.type !== bodiedExtension
      ) {
        tr = replaceSelectedNode(node)(tr);
      } else {
        tr = safeInsert(node)(tr);
      }
      view.dispatch(tr.scrollIntoView());
      return true;
    }
  }

  return false;
};

export const resolveMacro = (
  macro?: ExtensionAttributes,
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

// gets the extensionProvider from the state and tries to autoConvert a given text
export const runMacroAutoConvert = (
  state: EditorState,
  text: String,
): PmNode | null => {
  const macroPluginState = pluginKey.getState(state);

  const extensionProvider =
    macroPluginState && macroPluginState.extensionProvider;
  if (!extensionProvider || !extensionProvider.autoConvert) {
    return null;
  }

  const macroAttributes = extensionProvider.autoConvert(text);
  if (!macroAttributes) {
    return null;
  }

  // decides which kind of macro to render (inline|bodied|bodyless) - will be just inline atm.
  return resolveMacro(macroAttributes, state);
};

export const setExtensionProvider = (
  provider: Promise<ExtensionProvider>,
) => async (view: EditorView): Promise<boolean> => {
  let resolvedProvider: ExtensionProvider | null;
  try {
    resolvedProvider = await provider;
    assert(
      resolvedProvider && resolvedProvider.openMacroBrowser,
      `ExtensionProvider promise did not resolve to a valid instance of ExtensionProvider - ${resolvedProvider}`,
    );
  } catch (err) {
    resolvedProvider = null;
  }
  view.dispatch(
    view.state.tr.setMeta(pluginKey, { extensionProvider: resolvedProvider }),
  );
  return true;
};
