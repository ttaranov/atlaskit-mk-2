// @flow
import type { Comment } from './Comment';

export type Conversation = {
  conversationId: string,
  containerId: string,
  localId?: string,
  comments?: Comment[],
  meta: {
    [key: string]: any,
  },
  error?: Error,
};
