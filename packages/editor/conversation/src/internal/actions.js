// @flow
import { ResourceProvider } from '../api/ConversationResource';
import type { User } from '../model';

export const FETCH_CONVERSATIONS_REQUEST = 'fetchConversationsRequest';
export const FETCH_CONVERSATIONS_SUCCESS = 'fetchConversationsSuccess';

export const ADD_COMMENT_REQUEST = 'addCommentRequest';
export const ADD_COMMENT_SUCCESS = 'addCommentSuccess';
export const ADD_COMMENT_ERROR = 'addCommentError';

export const DELETE_COMMENT_REQUEST = 'deleteCommentRequest';
export const DELETE_COMMENT_SUCCESS = 'deleteCommentSuccess';
export const DELETE_COMMENT_ERROR = 'deleteCommentError';

export const UPDATE_COMMENT_REQUEST = 'updateCommentRequest';
export const UPDATE_COMMENT_SUCCESS = 'updateCommentSuccess';
export const UPDATE_COMMENT_ERROR = 'updateCommentError';

export const REVERT_COMMENT = 'revertComment';

export const UPDATE_USER_SUCCESS = 'updateUserSuccess';

export const CREATE_CONVERSATION_REQUEST = 'createConversationRequest';
export const CREATE_CONVERSATION_SUCCESS = 'createConversationSuccess';
export const CREATE_CONVERSATION_ERROR = 'createConversationError';

export const addComment = (
  conversationId: string,
  parentId: string,
  value: any,
  localId: string | typeof undefined = undefined,
  provider: ResourceProvider,
) => async () => {
  provider.addComment(conversationId, parentId, value, localId);
};

export const updateComment = (
  conversationId: string,
  commentId: string,
  value: any,
  provider: ResourceProvider,
) => async () => {
  provider.updateComment(conversationId, commentId, value);
};

export const deleteComment = (
  conversationId: string,
  commentId: string,
  provider: ResourceProvider,
) => async () => {
  provider.deleteComment(conversationId, commentId);
};

export const revertComment = (
  conversationId: string,
  commentId: string,
  provider: ResourceProvider,
) => async () => {
  provider.revertComment(conversationId, commentId);
};

export const updateUser = (
  user: User,
  provider: ResourceProvider,
) => async () => {
  provider.updateUser(user);
};

export const createConversation = (
  localId: string,
  containerId: string,
  value: any,
  meta: any,
  provider: ResourceProvider,
) => async () => {
  provider.create(localId, containerId, value, meta);
};
