import { Conversation } from './Conversation';
import { User } from './User';
export interface Comment extends Pick<Conversation, 'comments'> {
  commentId: string;
  conversationId: string;
  parentId?: string;
  document: {
    adf?: any; // ADF
    md?: string;
    html?: string;
  };
  createdBy: User;
  createdAt: number;
  deleted?: boolean;
}
