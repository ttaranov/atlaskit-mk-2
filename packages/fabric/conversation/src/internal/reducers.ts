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
  CREATE_CONVERSATION,
  CREATE_CONVERSATION_SUCCESS,
} from './actions';
import { Action, State } from './store';
import { User, Conversation, Comment } from '../model';

const updateCommentInConversation = (
  conversations: Conversation[],
  conversationId: string,
  predicate: (comment: Comment) => boolean,
  newComment: Comment,
) =>
  conversations.map(
    conversation =>
      conversation.conversationId !== conversationId
        ? conversation
        : {
            ...conversation,
            comments: (conversation.comments || []).map(
              comment =>
                !predicate(comment)
                  ? comment
                  : {
                      ...comment,
                      ...newComment,
                    },
            ),
          },
  );

const addCommentToConversation = (
  conversations: Conversation[],
  conversationId: string,
  newComment: Comment,
) =>
  conversations.map(
    conversation =>
      conversation.conversationId !== conversationId
        ? conversation
        : {
            ...conversation,
            comments: [...(conversation.comments || []), newComment],
          },
  );

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
    const { conversations } = state;
    const { payload } = action;

    return {
      ...state,
      conversations: addCommentToConversation(
        conversations,
        payload.conversationId,
        {
          ...payload,
          state: 'SAVING',
        },
      ),
    };
  },

  [ADD_COMMENT_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    const { payload } = action;

    return {
      ...state,
      conversations: payload.localId
        ? updateCommentInConversation(
            conversations,
            payload.conversationId,
            comment => comment.localId === payload.localId,
            {
              ...payload,
              state: undefined,
            },
          )
        : addCommentToConversation(conversations, payload.conversationId, {
            ...payload,
          }),
    };
  },

  [UPDATE_COMMENT](state: State, action: Action) {
    const { conversations } = state;
    const { payload } = action;

    return {
      ...state,
      conversations: updateCommentInConversation(
        conversations,
        payload.conversationId,
        comment => comment.commentId === payload.commentId,
        {
          ...payload,
          state: 'SAVING',
        },
      ),
    };
  },

  [UPDATE_COMMENT_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    const { payload } = action;

    return {
      ...state,
      conversations: updateCommentInConversation(
        conversations,
        payload.conversationId,
        comment => comment.commentId === payload.commentId,
        {
          ...payload,
          state: undefined,
        },
      ),
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

  [CREATE_CONVERSATION](state: State, action: Action) {
    const { conversations } = state;
    const { payload } = action;
    const [comment] = payload.comments!;

    return {
      ...state,
      conversations: [
        ...conversations,
        {
          ...payload,
          comments: [
            {
              ...comment,
              state: 'SAVING',
            },
          ],
        },
      ],
    };
  },

  [CREATE_CONVERSATION_SUCCESS](state: State, action: Action) {
    const { conversations } = state;
    const { payload } = action;

    return {
      ...state,
      conversations: conversations.map(
        conversation =>
          conversation.localId && conversation.localId === payload.localId
            ? payload
            : conversation,
      ),
    };
  },
};
