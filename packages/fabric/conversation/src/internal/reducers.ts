import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
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
  // CREATE_CONVERSATION_ERROR,
} from './actions';
import { Action, State } from './store';
import { User, Conversation, Comment } from '../model';

const updateComment = (
  comments: Comment[] | undefined,
  newComment: Comment,
  storeOriginal?: boolean,
) => {
  return (comments || []).map(comment => {
    if (
      (newComment.localId && comment.localId === newComment.localId) ||
      comment.commentId === newComment.commentId
    ) {
      console.log(
        comment.document.adf.content[0].content[0].text,
        comment.oldDocument &&
          comment.oldDocument.adf.content[0].content[0].text,
      );
      return {
        ...comment,
        ...newComment,
        oldDocument: storeOriginal ? comment.document : comment.oldDocument,
      };
    }
    return comment;
  });
};

const deleteComment = (comments: Comment[] | undefined, commentId: string) => {
  return (comments || []).map(comment => {
    if (comment.commentId === commentId) {
      return {
        ...comment,
        deleted: true,
      };
    }
    return comment;
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
  storeOriginal?: boolean,
) => {
  return conversations.map(conversation => {
    if (conversation.conversationId === newComment.conversationId) {
      const comments = updateComment(
        conversation.comments,
        newComment,
        storeOriginal,
      );
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
      return {
        ...conversation,
        comments: [...comments, newComment],
      };
    }
    return conversation;
  });
};

const deleteCommentInConversation = (
  conversations: Conversation[],
  deletedComment: Comment,
) => {
  return conversations.map(conversation => {
    if (conversation.conversationId === deletedComment.conversationId) {
      const comments = deleteComment(
        conversation.comments,
        deletedComment.commentId,
      );
      return {
        ...conversation,
        comments,
      };
    }
    return conversation;
  });
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

  [ADD_COMMENT_REQUEST](state: State, action: Action) {
    const { payload } = action;
    const conversations = addCommentToConversation(state.conversations, {
      ...payload,
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
      });
    } else {
      conversations = addCommentToConversation(state.conversations, payload);
    }

    return {
      ...state,
      conversations,
    };
  },

  [UPDATE_COMMENT_REQUEST](state: State, action: Action) {
    const { payload } = action;

    const conversations = updateCommentInConversation(
      state.conversations,
      {
        ...payload,
        state: 'SAVING',
      },
      true,
    );

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
    return {
      ...state,
    };
  },

  [DELETE_COMMENT_SUCCESS](state: State, action: Action) {
    const { payload } = action;
    const conversations = deleteCommentInConversation(
      state.conversations,
      payload,
    );

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

    const conversations = updateCommentInConversation(state.conversations, {
      ...payload,
      state: undefined,
      document: payload.oldDocument,
    });

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
};
