import { Conversation } from './Conversation';
import { User } from './User';
export interface Comment extends Conversation {
  document: any; // ADF
  createdBy: User;
  createdAt: number;
}
