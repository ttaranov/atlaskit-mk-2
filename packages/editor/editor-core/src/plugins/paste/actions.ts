import { EditorView } from 'prosemirror-view';
import { stateKey } from './pm-plugins/main';
import { pluginKey as macroPluginKey, resolveMacro } from '../macro/';

// gets the macroProvider from the state and tries to autoConvert a given text
export const handleStartCardsOnPaste = (text: string) => async (
  view: EditorView,
): Promise<boolean> => {
  const macroPluginState = macroPluginKey.getState(view.state);
  const macroProvider = macroPluginState && macroPluginState.macroProvider;
  if (!macroProvider || !macroProvider.autoConvert) {
    return false;
  }

  const macroAttributes = await macroProvider.autoConvert(text);
  if (!macroAttributes) {
    return false;
  }

  const { smartCardPosition } = stateKey.getState(view.state);

  // decides which kind of macro to render (inline|bodied|bodyless) - will be just inline atm.
  const node = resolveMacro(macroAttributes, view.state);
  if (node) {
    view.dispatch(
      view.state.tr
        .replaceWith(smartCardPosition - text.length, smartCardPosition, node)
        .setMeta(stateKey, { smartCardPosition: null }),
    );
  }

  return true;
};
