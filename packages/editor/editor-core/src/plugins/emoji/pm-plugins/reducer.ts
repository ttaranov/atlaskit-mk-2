import { EmojiPluginState, EmojiPluginAction } from '../types';

export default (
  state: EmojiPluginState,
  action: EmojiPluginAction,
): EmojiPluginState => {
  switch (action.type) {
    case 'SET_PROVIDER':
      return { ...state, provider: action.provider };
    case 'SET_EMOJIS':
      return { ...state, emojis: action.emojis };
  }
};
