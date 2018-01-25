import { ResourceProvider } from '../api/ConversationResource';
import { User, Comment } from '../model';

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

export const deleteComment = (
  conversationId: string,
  commentId: string,
) => async (provider: ResourceProvider) => {
  provider.deleteComment(conversationId, commentId);
};

export const revertComment = (comment: Comment) => async (
  provider: ResourceProvider,
) => {
  provider.revertComment(comment);
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
