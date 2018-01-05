import { ResourceProvider } from '../api/ConversationResource';

export const FETCH_CONVERSATIONS = 'fetchConversations';
export const FETCH_CONVERSATIONS_SUCCESS = 'fetchConversationsSucess';

export const ADD_COMMENT = 'addComment';
export const ADD_COMMENT_SUCCESS = 'addCommentSucess';

export const CREATE_CONVERSATION = 'createConversation';
export const CREATE_CONVERSATION_SUCCESS = 'createConversationSuccess';

export const addComment = (
  conversationId: string,
  parentId: string,
  value: any,
) => async (provider: ResourceProvider) => {
  provider.addComment(conversationId, parentId, value);
};

export const createConversation = (
  localId: string,
  containerId: string,
  value: any,
  meta: any,
) => async (provider: ResourceProvider) => {
  provider.create(localId, containerId, value, meta);
};
