import { Transaction, EditorState } from 'prosemirror-state';
import {
  InitData,
  ConnectionData,
  RemoteData,
  TelepointerData,
  PresenceData,
} from './types';

export type CollabEvent =
  | 'init'
  | 'connected'
  | 'data'
  | 'telepointer'
  | 'presence'
  | 'error';

export interface CollabEventData {
  init: InitData;
  connected: ConnectionData;
  data: RemoteData;
  telepointer: TelepointerData;
  presensense: PresenceData;
  error: any;
}

export interface CollabEditProvider {
  initialize(getState: () => any): this;
  send(tr: Transaction, oldState: EditorState, newState: EditorState): void;
  on(evt: CollabEvent, handler: (...args) => void): this;
  sendMessage<T extends keyof CollabEventData>(
    data: { type: T } & CollabEventData[T],
  );
}
