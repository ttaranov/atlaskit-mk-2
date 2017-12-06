import { Comment } from './Comment';
export interface Conversation {
  id: string;
  externalId: string;
  children?: Comment[];
  meta?: {
    [key: string]: any;
  };
}
