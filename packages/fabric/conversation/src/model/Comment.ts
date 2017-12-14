import { Conversation } from './Conversation';
import { User } from './User';
export interface Comment extends Pick<Conversation, 'id' | 'children'> {
  document: any; // ADF
  createdBy: User;
  createdAt: number;
}
