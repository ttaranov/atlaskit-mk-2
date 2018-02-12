import { Auth } from './auth';

export interface AuthContext {
  readonly collectionName?: string;
}

export type AuthProvider = (context?: AuthContext) => Promise<Auth>;
