import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

export interface Participant {
  lastActive: number;
  sessionId: string;
  avatar: string;
  name: string;
  email: string;
}

export interface InitData {
  doc?: any;
  json?: any;
}

export interface RemoteData {
  json?: any;
  newState?: EditorState;
}

export interface ConnectionData {
  sid: string;
}

export interface PresenceData {
  joined?: Participant[];
  left?: { sessionId: string }[];
}

export interface TelepointerData {
  type: 'telepointer';
  selection: SendableSelection;
  sessionId: string;
}

export interface SendableSelection {
  type: 'textSelection' | 'nodeSelection';
  anchor: number;
  head: number;
}

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
  initialize(getState: () => any, createStep: (json: object) => Step): this;
  send(tr: Transaction, oldState: EditorState, newState: EditorState): void;
  on(evt: CollabEvent, handler: (...args) => void): this;
  sendMessage<T extends keyof CollabEventData>(
    data: { type: T } & CollabEventData[T],
  );
}
