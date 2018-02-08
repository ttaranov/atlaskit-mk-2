import { EditorState, Transaction } from 'prosemirror-state';

export * from './editor-instance';
export * from './editor-config';
export * from './editor-plugin';
export * from './editor-props';
export * from './editor-appearance-component';
export * from './extension-handler';

export type Command = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => boolean;
