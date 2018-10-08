import { EmojiProvider, EmojiId, EmojiDescription } from '@atlaskit/emoji';

import { Command } from '../../../types';
import { isChromeWithSelectionBug } from '../../../utils';
import { EmojiProviderHandler } from '../types';
import { createCommand, getPluginState } from './main';
import { Fragment } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';

export const setProvider = (
  provider?: EmojiProvider,
  providerHandler?: EmojiProviderHandler,
): Command => (state, dispatch) => {
  const oldState = getPluginState(state);
  if (oldState.provider && oldState.providerHandler) {
    oldState.provider.unsubscribe(oldState.providerHandler);
  }

  if (provider && providerHandler) {
    provider.subscribe(providerHandler);
  }

  return createCommand({
    type: 'SET_PROVIDER',
    provider,
    providerHandler,
  })(state, dispatch);
};

export const setEmojis = (emojis: Array<EmojiDescription> = []) =>
  createCommand({
    type: 'SET_EMOJIS',
    emojis,
  });

export const insertEmoji = (emoji: EmojiId): Command => (state, dispatch) => {
  const { schema, selection } = state;
  const node = schema.nodes.emoji.create(emoji);
  const fragment = Fragment.fromArray([node, schema.text(' ')]);
  let tr = state.tr.replaceWith(selection.from, selection.to, fragment);

  // This problem affects Chrome v58-62. See: https://github.com/ProseMirror/prosemirror/issues/710
  if (isChromeWithSelectionBug) {
    const selection = document.getSelection();
    if (selection) {
      selection.empty();
    }
  }

  // Placing cursor after node + space.
  tr = tr.setSelection(
    Selection.near(tr.doc.resolve(selection.from + fragment.size)),
  );

  dispatch(tr);
  return true;
};
