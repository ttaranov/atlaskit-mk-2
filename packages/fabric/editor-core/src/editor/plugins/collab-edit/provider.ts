import {
  Transaction,
  EditorState,
} from 'prosemirror-state';

export type CollabEvent = 'init' | 'connected' | 'data' | 'telepointer' | 'presence' | 'error';

export interface CollabEditProvider {
  initialize(getState: () => any): this;
  send(tr: Transaction, oldState: EditorState, newState: EditorState): void;
  on(evt: CollabEvent, handler: (...args) => void): this;
  sendMessage(data: { type: 'telepointer', [key: string]: any });
}
