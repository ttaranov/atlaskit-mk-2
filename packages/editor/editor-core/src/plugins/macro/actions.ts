import { EditorState, NodeSelection } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MacroProvider, MacroAttributes } from './types';
import { pluginKey } from './';
import * as assert from 'assert';
import { getValidNode } from '@atlaskit/editor-common';
import {
  safeInsert,
  replaceSelectedNode,
  hasParentNodeOfType,
} from 'prosemirror-utils';

export const insertMacroFromMacroBrowser = (
  macroProvider: MacroProvider,
  macroNode?: PmNode,
) => async (view: EditorView): Promise<boolean> => {
  if (!macroProvider) {
    return false;
  }
  // opens MacroBrowser for editing "macroNode" if passed in
  const newMacro: MacroAttributes = await macroProvider.openMacroBrowser(
    macroNode,
  );
  if (newMacro) {
    const currentLayout = (macroNode && macroNode.attrs.layout) || 'default';
    const node = resolveMacro(newMacro, view.state, { layout: currentLayout });
    const {
      schema: {
        nodes: { bodiedExtension },
      },
    } = view.state;
    let { tr } = view.state;
    if (node) {
      if (
        // trying to replace selected node
        tr.selection instanceof NodeSelection &&
        // selected node is not nested in bodiedExtension
        !hasParentNodeOfType(bodiedExtension)(tr.selection)
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
  macro?: MacroAttributes,
  state?: EditorState,
  optionalAttrs?: object,
): PmNode | null => {
  if (!macro || !state) {
    return null;
  }

  const { schema } = state;
  const { type, attrs } = getValidNode(macro, schema);
  let node;

  if (type === 'extension') {
    node = schema.nodes.extension.create({ ...attrs, ...optionalAttrs });
  } else if (type === 'bodiedExtension') {
    node = schema.nodes.bodiedExtension.create(
      { ...attrs, ...optionalAttrs },
      schema.nodeFromJSON(macro).content,
    );
  } else if (type === 'inlineExtension') {
    node = schema.nodes.inlineExtension.create(attrs);
  }

  return node;
};

// gets the macroProvider from the state and tries to autoConvert a given text
export const runMacroAutoConvert = (
  state: EditorState,
  text: String,
): PmNode | null => {
  const macroPluginState = pluginKey.getState(state);

  const macroProvider = macroPluginState && macroPluginState.macroProvider;
  if (!macroProvider || !macroProvider.autoConvert) {
    return null;
  }

  const macroAttributes = macroProvider.autoConvert(text);
  if (!macroAttributes) {
    return null;
  }

  // decides which kind of macro to render (inline|bodied|bodyless) - will be just inline atm.
  return resolveMacro(macroAttributes, state);
};

export const setMacroProvider = (provider: Promise<MacroProvider>) => async (
  view: EditorView,
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
  view.dispatch(
    view.state.tr.setMeta(pluginKey, { macroProvider: resolvedProvider }),
  );
  return true;
};
