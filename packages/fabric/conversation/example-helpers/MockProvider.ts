import {
  ConversationResourceConfig,
  AbstractConversationResource,
} from '../src/api/ConversationResource';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Comment, Conversation, User } from '../src/model';
import { uuid } from '../src/internal/uuid';
import { generateMockConversation, mockInlineConversation } from './MockData';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { HttpError } from '../src/api/HttpError';

import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_ERROR,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_ERROR,
  REVERT_COMMENT,
  CREATE_CONVERSATION_REQUEST,
  CREATE_CONVERSATION_SUCCESS,
  UPDATE_USER_SUCCESS,
} from '../src/internal/actions';

const MockDataProviders = {
  mentionProvider: Promise.resolve(mentionStoryData.resourceProvider),
  emojiProvider: Promise.resolve(
    emojiStoryData.getEmojiResource({ uploadSupported: true }),
  ),
};

export const getDataProviderFactory = () => {
  const dataProviderFactory = new ProviderFactory();
  Object.keys(MockDataProviders).forEach(provider => {
    dataProviderFactory.setProvider(provider, MockDataProviders[provider]);
  });
  return dataProviderFactory;
};

export class MockProvider extends AbstractConversationResource {
  private config: ConversationResourceConfig;

  constructor(config: ConversationResourceConfig) {
    super();
    this.config = config;
    this.updateUser(config.user);
  }

  /**
   * Retrieve the IDs (and meta-data) for all conversations associated with the container ID.
   */
  async getConversations(): Promise<Conversation[]> {
    const { dispatch } = this;
    dispatch({ type: FETCH_CONVERSATIONS_REQUEST });

    const values = [generateMockConversation(), mockInlineConversation];
    dispatch({ type: FETCH_CONVERSATIONS_SUCCESS, payload: values });

    return values;
  }

  /**
   * Creates a new Conversation and associates it with the containerId provided.
   */
  async create(
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ): Promise<Conversation> {
    const conversationId = <string>uuid.generate();

    const result = {
      conversationId,
      containerId,
      localId,
      comments: [this.createComment(conversationId, conversationId, value)],
      meta: meta,
    };

    const { dispatch } = this;

    dispatch({ type: CREATE_CONVERSATION_REQUEST, payload: result });

    setTimeout(() => {
      dispatch({ type: CREATE_CONVERSATION_SUCCESS, payload: result });
    }, 1000);

    return result;
  }

  /**
   * Adds a comment to a parent. ParentId can be either a conversation or another comment.
   */
  async addComment(
    conversationId: string,
    parentId: string,
    doc: any,
  ): Promise<Comment> {
    const result = this.createComment(conversationId, parentId, doc);
    const { dispatch } = this;

    dispatch({ type: ADD_COMMENT_REQUEST, payload: result });

    setTimeout(() => {
      dispatch({ type: ADD_COMMENT_SUCCESS, payload: result });
    }, 1000);

    return result;
  }

  private createComment(
    conversationId: string,
    parentId: string,
    doc: any,
    localId: string = <string>uuid.generate(),
  ): Comment {
    return {
      createdBy: this.config.user,
      createdAt: Date.now(),
      commentId: <string>uuid.generate(),
      document: {
        adf: doc,
      },
      conversationId,
      parentId,
      comments: [],
      localId,
    };
  }

  /**
   * Updates a comment based on ID. Returns updated content
   */
  async updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<Comment> {
    const result = {
      createdBy: this.config.user,
      createdAt: Date.now(),
      document: {
        adf: document,
      },
      conversationId,
      commentId,
      comments: [],
    };

    const { dispatch } = this;
    dispatch({ type: UPDATE_COMMENT_REQUEST, payload: result });

    setTimeout(() => {
      // dispatch({ type: UPDATE_COMMENT_SUCCESS, payload: result });
      const errResult = {
        conversationId,
        commentId,
        error: new HttpError(503, 'ruh roh'),
      };
      dispatch({ type: UPDATE_COMMENT_ERROR, payload: errResult });
    }, 200);

    return result;
  }

  /**
   * Deletes a comment based on ID. Returns deleted comment
   * @param {string} conversationId
   * @param {string} commentId
   * @returns {Promise<Comment>}
   */
  async deleteComment(
    conversationId: string,
    commentId: string,
  ): Promise<Pick<Comment, 'conversationId' | 'commentId' | 'error'>> {
    const result = {
      conversationId,
      commentId,
      error: new HttpError(500, 'yeh nah'),
    };

    const { dispatch } = this;

    // setTimeout(() => {
    dispatch({ type: DELETE_COMMENT_ERROR, payload: result });
    // }, 1000);
    // dispatch({ type: DELETE_COMMENT_SUCCESS, payload: result });

    return result;
  }

  /**
   * Reverts a comment based on ID. Returns updated comment.
   */
  async revertComment(comment: Comment): Promise<Comment> {
    const { dispatch } = this;

    dispatch({ type: REVERT_COMMENT, payload: comment });

    return comment;
  }

  /**
   * Updates a user in the store. Returns updated user
   */
  async updateUser(user: User): Promise<User> {
    const { dispatch } = this;
    dispatch({ type: UPDATE_USER_SUCCESS, payload: { user } });
    this.config.user = user;

    return user;
  }
}
