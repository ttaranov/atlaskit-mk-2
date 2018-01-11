import { State } from './store';
import { Comment, Conversation, User } from '../model';

export const getConversation = (
  state: State,
  conversationId: string,
): Conversation | undefined =>
  state.conversations.filter(
    c => c.conversationId === conversationId || c.localId === conversationId,
  )[0];
export const getComments = (
  state: State,
  conversationId: string,
  parentId?: string,
): Comment[] => {
  const conversation = getConversation(state, conversationId);
  if (conversation) {
    if (parentId) {
      return (conversation.comments || []).filter(c => c.parentId === parentId);
    }

    return (conversation.comments || []).filter(
      c =>
        (!c.parentId && c.conversationId === conversation.conversationId) ||
        (c.parentId && c.parentId === conversation.conversationId),
    );
  }
  return [];
};

export const getUser = (state: State): User | undefined => state.user;
