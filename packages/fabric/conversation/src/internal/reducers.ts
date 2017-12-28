import {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT,
  ADD_COMMENT_SUCCESS,
  CREATE_CONVERSATION_SUCCESS,
} from './actions';
import { Action, State } from './store';

export const reducers = {
  [FETCH_CONVERSATIONS](state: State, action: Action) {
    return {
      ...state,
    };
  },

  [FETCH_CONVERSATIONS_SUCCESS](state: State, action: Action) {
    return {
      ...state,
      conversations: action.payload,
    };
  },

  [ADD_COMMENT](state: State, action: Action) {
    return {
      ...state,
    };
  },

  [ADD_COMMENT_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    conversations
      .filter(c => c.conversationId === action.payload.conversationId)[0]
      .comments.push(action.payload);

    return {
      ...state,
      conversations,
    };
  },

  [CREATE_CONVERSATION_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    conversations.push(action.payload);

    return {
      ...state,
      conversations,
    };
  },
};
