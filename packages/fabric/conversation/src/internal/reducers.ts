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
import { Action, State } from './store';
import { User, Conversation, Comment } from '../model';

const updateComment = (
  comments: Comment[] | undefined,
  newComment: Comment,
) => {
  return (comments || []).map(comment => {
    if (
      (newComment.localId && comment.localId === newComment.localId) ||
      comment.commentId === newComment.commentId
    ) {
      return {
        ...comment,
        oldDocument: comment.oldDocument
          ? comment.oldDocument
          : comment.document,
        ...newComment,
      };
    }
    return comment;
  });
};

const removeComment = (
  comments: Comment[] | undefined,
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

const addCommentToConversation = (
  conversations: Conversation[],
  newComment: Comment,
) => {
  return conversations.map(conversation => {
    if (conversation.conversationId === newComment.conversationId) {
      const { comments = [] } = conversation;

      // If the comment already exists, update the existing one
      if (comments.some(comment => newComment.localId === comment.localId)) {
        return {
          ...conversation,
          comments: [...updateComment(comments, newComment)],
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
  return conversations
    .map(conversation => {
      if (conversation.conversationId === commentToRemove.conversationId) {
        const comments = removeComment(conversation.comments, commentToRemove);

        // If there's no comments, remove the conversation as wel
        if (comments.length === 0) {
          return null;
        }

        return {
          ...conversation,
          comments,
        };
      }
      return conversation;
    })
    .filter(conversation => conversation !== null) as Conversation[];
};

export const reducers = {
  [FETCH_CONVERSATIONS_REQUEST](state: State, action: Action) {
    return {
      ...state,
    };
  },

  [FETCH_CONVERSATIONS_SUCCESS](state: State, action: Action) {
    const conversations: Conversation[] = [
      ...state.conversations,
      ...action.payload,
    ];

    return {
      ...state,
      conversations,
    };
  },

  // @TODO fetch conversations error

  [ADD_COMMENT_REQUEST](state: State, action: Action) {
    const { payload } = action;
    const conversations = addCommentToConversation(state.conversations, {
      ...payload,
      isPlaceholder: true,
      state: 'SAVING',
    });

    return {
      ...state,
      conversations,
    };
  },

  [ADD_COMMENT_SUCCESS](state: State, action: Action) {
    const { payload } = action;

    let conversations: Conversation[];

    if (payload.localId) {
      conversations = updateCommentInConversation(state.conversations, {
        ...payload,
        state: undefined,
        oldDocument: undefined,
        isPlaceholder: false,
      });
    } else {
      conversations = addCommentToConversation(state.conversations, payload);
    }

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
      deleted: true,
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

    let conversations: Conversation[];

    if (payload.isPlaceholder) {
      conversations = removeCommentFromConversation(state.conversations, {
        ...payload,
      });
    } else {
      conversations = updateCommentInConversation(state.conversations, {
        ...payload,
        state: undefined,
        document: payload.oldDocument,
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
    return {
      ...state,
      user: <User>action.payload.user,
    };
  },

  [CREATE_CONVERSATION_REQUEST](state: State, action: Action) {
    const { payload } = action;
    const [comment] = payload.comments!;
    const conversations = [
      ...state.conversations,
      {
        ...payload,
        comments: [
          {
            ...comment,
            state: 'SAVING',
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
    const conversations = updateConversation(state.conversations, payload);

    return {
      ...state,
      conversations,
    };
  },

  [CREATE_CONVERSATION_ERROR](state: State, action: Action) {
    const { payload } = action;

    const conversations = [
      ...state.conversations,
      {
        ...payload,
        comments: [],
      },
    ];

    return {
      ...state,
      conversations,
    };
  },
};
