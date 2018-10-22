export type Command = { type: 'init' } | { type: 'reload'; provider: string };

export type ObjectStatus =
  | 'resolving'
  | 'not-found'
  | 'resolved'
  | 'unauthorized'
  | 'forbidden'
  | 'errored';

export interface AuthService {
  id: string;
  name: string;
  startAuthUrl: string;
}

export interface ObjectState {
  status: ObjectStatus;
  definitionId?: string;
  services: AuthService[];
  data?: { [name: string]: any };
}
