import { createContext } from 'react';
import { Document } from '../model';

export interface ContextType {
  value: State;
  actions: Actions;
  renderProps: any;
}

export interface State {
  doc?: Document;
  isLoading?: boolean;
  hasError?: boolean;
  mode?: Mode;
}

export type Mode = 'view' | 'edit' | 'create';

export interface Actions {
  getDocument(documentId: string, language?: string): void;
  setDocumentMode(mode: Mode): void;
  updateDocument(body: string, title?: string, language?: string): void;
  createDocument(body: string, title?: string, language?: string): void;
}

const noop = () => {};

export const Context = createContext<ContextType>({
  value: {},
  actions: {
    getDocument: noop,
    setDocumentMode: noop,
    updateDocument: noop,
    createDocument: noop,
  },
  renderProps: {},
});
