// @flow
import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_ERROR,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_ERROR,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_ERROR,
  REVERT_COMMENT,
  UPDATE_USER_SUCCESS,
  CREATE_CONVERSATION_REQUEST,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_CONVERSATION_ERROR,
} from './actions';
import type { Action, State } from './store';
import type { Conversation, Comment } from '../model';
import { createReducer } from './create-reducer';

const updateComment = (
  comments: Comment[] | typeof undefined,
  newComment: Comment,
) => {
  return (comments || []).map(comment => {
    if (
      (newComment.localId && comment.localId === newComment.localId) ||
      comment.commentId === newComment.commentId
    ) {
      return {
        ...comment,
        oldDocument: comment.oldDocument || comment.document,
        ...newComment,
      };
    }
    return comment;
  });
};

const removeComment = (
  comments: Comment[] | typeof undefined,
  commentToRemove: Comment,
) => {
  return (comments || []).filter(comment => {
    return (
      (commentToRemove.localId &&
        comment.localId !== commentToRemove.localId) ||
      comment.commentId !== commentToRemove.commentId
    );
  });
};

const updateConversation = (
  conversations: Conversation[],
  newConversation: Conversation,
) => {
  return conversations.map(conversation => {
    if (conversation.localId === newConversation.localId) {
      return newConversation;
    }
    return conversation;
  });
};

const updateCommentInConversation = (
  conversations: Conversation[],
  newComment: Comment,
) => {
  return conversations.map(conversation => {
    if (conversation.conversationId === newComment.conversationId) {
      const comments = updateComment(conversation.comments, newComment);
      return {
        ...conversation,
        comments,
      };
    }
    return conversation;
  });
};

const addOrUpdateCommentInConversation = (
  conversations: Conversation[],
  newComment: Comment,
) => {
  return conversations.map(conversation => {
    if (conversation.conversationId === newComment.conversationId) {
      const { comments = [] } = conversation;

      // If the comment already exists, update the existing one
      if (
        newComment.localId &&
        comments.some(comment => newComment.localId === comment.localId)
      ) {
        return {
          ...conversation,
          comments: updateComment(comments, newComment),
        };
      }

      // Otherwise, add it
      return {
        ...conversation,
        comments: [...comments, newComment],
      };
    }
    return conversation;
  });
};

const removeCommentFromConversation = (
  conversations: Conversation[],
  commentToRemove: Comment,
): Conversation[] => {
  return conversations.reduce((current, conversation) => {
    if (conversation.conversationId === commentToRemove.conversationId) {
      const comments = removeComment(conversation.comments, commentToRemove);

      // If there's no comments, don't add the conversation
      if (comments.length === 0) {
        return current;
      }

      return [
        ...current,
        {
          ...conversation,
          comments,
        },
      ];
    }
    return [...current, conversation];
  }, []);
};

const getCommentFromConversation = (
  conversations: Conversation[],
  commentToFind: Comment,
): Comment | null => {
  const { commentId, conversationId } = commentToFind;
  if (!conversationId || !commentId) {
    return null;
  }

  const [comment = null] = conversations.reduce((acc, conversation) => {
    if (
      conversation.conversationId !== conversationId ||
      !conversation.comments
    ) {
      return acc;
    }

    return conversation.comments.reduce((commentsAcc, c) => {
      if (c.commentId !== commentId) {
        return commentsAcc;
      }

      return [...commentsAcc, c];
    }, acc);
  }, []);

  return comment;
};

export const initialState = {
  conversations: [],
};

export const reducers = createReducer(initialState, {
  [FETCH_CONVERSATIONS_REQUEST](state: State) {
    return {
      ...state,
    };
  },

  [FETCH_CONVERSATIONS_SUCCESS](state: State, action: Action) {
    const { payload } = action;

    if (!payload) {
      return state;
    }

    const conversations: Conversation[] = state.conversations.concat(payload);

    return {
      ...state,
      conversations,
    };
  },

  [ADD_COMMENT_REQUEST](state: State, action: Action) {
    const { payload } = action;
    const conversations = addOrUpdateCommentInConversation(
      state.conversations,
      {
        ...payload,
        isPlaceholder: true,
        state: 'SAVING',
      },
    );

    return {
      ...state,
      conversations,
    };
  },

  [ADD_COMMENT_SUCCESS](state: State, action: Action) {
    const { payload } = action;

    const conversations: Conversation[] = addOrUpdateCommentInConversation(
      state.conversations,
      {
        ...payload,
        state: undefined,
        oldDocument: undefined,
        isPlaceholder: false,
      },
    );

    return {
      ...state,
      conversations,
    };
  },

  [ADD_COMMENT_ERROR](state: State, action: Action) {
    const { payload } = action;

    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: 'ERROR',
    });

    return {
      ...state,
      conversations,
    };
  },

  [UPDATE_COMMENT_REQUEST](state: State, action: Action) {
    const { payload } = action;

    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: 'SAVING',
    });

    return {
      ...state,
      conversations,
    };
  },

  [UPDATE_COMMENT_SUCCESS](state: State, action: Action) {
    const { payload } = action;

    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: undefined,
      oldDocument: undefined,
    });

    return {
      ...state,
      conversations,
    };
  },

  [UPDATE_COMMENT_ERROR](state: State, action: Action) {
    const { payload } = action;

    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: 'ERROR',
    });

    return {
      ...state,
      conversations,
    };
  },

  [DELETE_COMMENT_REQUEST](state: State, action: Action) {
    const { payload } = action;
    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: 'SAVING',
    });

    return {
      ...state,
      conversations,
    };
  },

  [DELETE_COMMENT_SUCCESS](state: State, action: Action) {
    const { payload } = action;
    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: undefined,
      deleted: true,
      oldDocument: undefined,
    });

    return {
      ...state,
      conversations,
    };
  },

  [DELETE_COMMENT_ERROR](state: State, action: Action) {
    const { payload } = action;

    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: 'ERROR',
    });

    return {
      ...state,
      conversations,
    };
  },

  [REVERT_COMMENT](state: State, action: Action) {
    const { payload } = action;

    if (!payload) {
      return state;
    }

    const comment = getCommentFromConversation(state.conversations, payload);
    let conversations: Conversation[];

    if (!comment) {
      return state;
    }

    if (comment.isPlaceholder) {
      conversations = removeCommentFromConversation(state.conversations, {
        ...payload,
      });
    } else {
      conversations = updateCommentInConversation(state.conversations, {
        ...payload,
        state: undefined,
        document: comment.oldDocument,
        deleted: false,
        oldDocument: undefined,
      });
    }

    return {
      ...state,
      conversations,
    };
  },

  [UPDATE_USER_SUCCESS](state: State, action: Action) {
    const { payload } = action;

    if (!payload) {
      return state;
    }

    return {
      ...state,
      user: payload.user,
    };
  },

  [CREATE_CONVERSATION_REQUEST](state: State, action: Action) {
    const { payload } = action;

    if (!payload) {
      return state;
    }

    const [comment] = payload.comments;
    const conversations = [
      ...state.conversations,
      {
        ...payload,
        comments: [
          {
            ...comment,
            state: 'SAVING',
            isPlaceholder: true,
          },
        ],
      },
    ];

    return {
      ...state,
      conversations,
    };
  },

  [CREATE_CONVERSATION_SUCCESS](state: State, action: Action) {
    const { payload } = action;

    if (!payload) {
      return state;
    }

    const conversations = updateConversation(state.conversations, payload);

    return {
      ...state,
      conversations,
    };
  },

  [CREATE_CONVERSATION_ERROR](state: State, action: Action) {
    const { payload } = action;

    if (!payload) {
      return state;
    }

    const { comments: [comment], error } = payload;

    const conversations = updateCommentInConversation(state.conversations, {
      ...comment,
      state: 'ERROR',
      error,
    });

    return {
      ...state,
      conversations,
    };
  },
});
