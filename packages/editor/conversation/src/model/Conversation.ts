import { Comment } from './Comment';

export interface Conversation {
  conversationId: string;
  containerId: string;
  localId?: string;
  comments?: Comment[];
  meta: {
    [key: string]: any;
  };
  error?: Error;
  isMain?: boolean;
}
