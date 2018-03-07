import { User } from '../types';

export interface PromiseBuilder<R> {
  (result: R, context: string): Promise<R>;
}

export interface MockEmojiResourceConfig {
  promiseBuilder?: PromiseBuilder<any>;
  uploadSupported?: boolean;
  uploadError?: string;
  optimisticRendering?: boolean;
  currentUser?: User;
}
