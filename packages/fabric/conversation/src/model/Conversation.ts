import { Comment } from './Comment';
export interface Conversation {
  id: string;
  containerId: string;
  children?: Comment[];
  meta?: {
    [key: string]: any;
  };
}
