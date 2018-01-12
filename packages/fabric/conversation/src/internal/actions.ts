import { ResourceProvider } from '../api/ConversationResource';
import { User } from '../model';

export const FETCH_CONVERSATIONS = 'fetchConversations';
export const FETCH_CONVERSATIONS_SUCCESS = 'fetchConversationsSuccess';

export const ADD_COMMENT = 'addComment';
export const ADD_COMMENT_SUCCESS = 'addCommentSuccess';

export const UPDATE_COMMENT = 'updateComment';
export const UPDATE_COMMENT_SUCCESS = 'updateCommentSuccess';

export const UPDATE_USER = 'updateUser';

export const CREATE_CONVERSATION = 'createConversation';
export const CREATE_CONVERSATION_SUCCESS = 'createConversationSuccess';

export const addComment = (
  conversationId: string,
  parentId: string,
  value: any,
) => async (provider: ResourceProvider) => {
  provider.addComment(conversationId, parentId, value);
};

export const updateComment = (
  conversationId: string,
  commentId: string,
  value: any,
) => async (provider: ResourceProvider) => {
  provider.updateComment(conversationId, commentId, value);
};

export const updateUser = (user: User) => async (
  provider: ResourceProvider,
) => {
  provider.updateUser(user);
};

export const createConversation = (
  localId: string,
  containerId: string,
  value: any,
  meta: any,
) => async (provider: ResourceProvider) => {
  provider.create(localId, containerId, value, meta);
};
