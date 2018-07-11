import { EditorState, Transaction } from 'prosemirror-state';

export type Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => boolean;
