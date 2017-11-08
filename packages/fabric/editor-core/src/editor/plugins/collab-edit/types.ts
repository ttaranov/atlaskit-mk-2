import { EditorState } from 'prosemirror-state';

export interface Participant {
  lastActive: number;
  sessionId: string;
  avatar: string;
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
