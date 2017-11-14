import { EditorView } from 'prosemirror-view';
import { getMacroType } from './utils';
import { MacroProvider, MacroParams, Macro } from './types';
import { pluginKey } from './plugin';
import * as assert from 'assert';

export const insertMacroFromMacroBrowser = async (view: EditorView, macroProvider: MacroProvider, macroParams?: MacroParams) => {
  if (!macroProvider) {
    return;
  }

  const newMacro: Macro = await macroProvider.openMacroBrowser(macroParams);
  if (newMacro) {
    const { state: { tr, schema }, dispatch } = view;
    const {
      macroId,
      name,
      placeholderUrl,
      params,
      displayType,
      plainTextBody,
      richTextBody
    } = newMacro;
    let node;

    switch (getMacroType(displayType, plainTextBody, richTextBody)) {
      case 'BODYLESS-INLINE':
        node = schema.nodes.inlineMacro.create({ macroId, name, placeholderUrl, params });
    }

    if (node) {
      dispatch(tr.replaceSelectionWith(node).scrollIntoView());
    }
  }
};

export const setMacroProvider = async (view: EditorView, name: string, provider: Promise<MacroProvider>) => {
  let resolvedProvider: MacroProvider | null;

  try {
    resolvedProvider = await provider;
    assert(
      resolvedProvider && resolvedProvider.openMacroBrowser,
      `MacroProvider promise did not resolve to a valid instance of MacroProvider - ${resolvedProvider}`
    );
  } catch (err) { resolvedProvider = null; }

  // make sure editable DOM node is mounted
  if (view.dom.parentNode) {
    view.dispatch(view.state.tr.setMeta(pluginKey, { macroProvider: resolvedProvider }));
  }
};

export const setMacroElement = (view: EditorView, macroElement: HTMLElement | null) => {
  view.dispatch(view.state.tr.setMeta(pluginKey, { macroElement }));
};

export const removeMacro = (view: EditorView) => {
  const { dispatch, state: { tr, selection } } = view;
  const { $from, $to } = selection;
  dispatch(
    tr
      .delete($from.pos, $to.pos)
      .setMeta(pluginKey, { macroElement: null })
  );
};
