import {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT,
  ADD_COMMENT_SUCCESS,
  UPDATE_COMMENT,
  UPDATE_COMMENT_SUCCESS,
  DELETE_COMMENT,
  DELETE_COMMENT_SUCCESS,
  UPDATE_USER,
  CREATE_CONVERSATION_SUCCESS,
} from './actions';
import { Action, State } from './store';
import { User, Conversation } from '../model';

export const reducers = {
  [FETCH_CONVERSATIONS](state: State, action: Action) {
    return {
      ...state,
    };
  },

  [FETCH_CONVERSATIONS_SUCCESS](state: State, action: Action) {
    return {
      ...state,
      conversations: <Conversation[]>action.payload,
    };
  },

  [ADD_COMMENT](state: State, action: Action) {
    return {
      ...state,
    };
  },

  [ADD_COMMENT_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    const conversation = conversations.filter(
      c => c.conversationId === action.payload.conversationId,
    )[0];

    const { comments = [] } = conversation;
    conversation.comments = [...comments, action.payload];

    return {
      ...state,
      conversations,
    };
  },

  [UPDATE_COMMENT](state: State, action: Action) {
    return {
      ...state,
    };
  },

  [UPDATE_COMMENT_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    const [conversation] = conversations.filter(
      c => c.conversationId === action.payload.conversationId,
    );

    const { comments = [] } = conversation;
    const [comment] = comments.filter(
      c => c.commentId === action.payload.commentId,
    );

    comment.document = action.payload.document;

    return {
      ...state,
      conversations,
    };
  },

  [DELETE_COMMENT](state: State, action: Action) {
    return {
      ...state,
    };
  },

  [DELETE_COMMENT_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    const [conversation] = conversations.filter(
      c => c.conversationId === action.payload.conversationId,
    );

    const { comments = [] } = conversation;
    const [comment] = comments.filter(
      c => c.commentId === action.payload.commentId,
    );

    comment.deleted = action.payload.deleted;

    return {
      ...state,
      conversations,
    };
  },

  [UPDATE_USER](state: State, action: Action) {
    return {
      ...state,
      user: <User>action.payload.user,
    };
  },

  [CREATE_CONVERSATION_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    conversations.push(<Conversation>action.payload);

    return {
      ...state,
      conversations,
    };
  },
};
