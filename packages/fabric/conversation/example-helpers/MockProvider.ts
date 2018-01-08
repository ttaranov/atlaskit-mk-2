import {
  ConversationResourceConfig,
  AbstractConversationResource,
} from '../src/api/ConversationResource';
import { Comment, Conversation, User } from '../src/model';
import { mockConversation, mockInlineConversation } from './MockData';

import {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT_SUCCESS,
  UPDATE_COMMENT_SUCCESS,
  CREATE_CONVERSATION_SUCCESS,
  UPDATE_USER,
} from '../src/internal/actions';

export class MockProvider extends AbstractConversationResource {
  private config: ConversationResourceConfig;
  private conversations: Map<string, Conversation> = new Map();

  constructor(config: ConversationResourceConfig) {
    super();
    this.config = config;
    this.conversations.set('mock-conversation', mockConversation);
    this.conversations.set('mock-inline-conversation', mockInlineConversation);
    this.updateUser(config.user);
  }

  /**
   * Retrieve the IDs (and meta-data) for all conversations associated with the container ID.
   */
  async getConversations(): Promise<Conversation[]> {
    const { dispatch } = this;
    dispatch({ type: FETCH_CONVERSATIONS });

    const values = [mockConversation, mockInlineConversation];
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
    const conversationId = `conversation-${Math.floor(
      Math.random() * 1000,
    )}-${Math.floor(Math.random() * 1000)}`;

    const result = {
      conversationId,
      containerId,
      localId,
      comments: [this.createComment(conversationId, conversationId, value)],
      meta: meta,
    };

    const { dispatch } = this;
    dispatch({ type: CREATE_CONVERSATION_SUCCESS, payload: result });

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
    dispatch({ type: ADD_COMMENT_SUCCESS, payload: result });

    return result;
  }

  private createComment(
    conversationId: string,
    parentId: string,
    doc: any,
  ): Comment {
    return {
      createdBy: this.config.user,
      createdAt: Date.now(),
      commentId: `comment-${Math.floor(Math.random() * 1000)}-${Math.floor(
        Math.random() * 1000,
      )}`,
      document: {
        adf: doc,
      },
      conversationId,
      parentId,
      comments: [],
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
    dispatch({ type: UPDATE_COMMENT_SUCCESS, payload: result });

    return result;
  }

  /**
   * Updates a user in the store. Returns updated user
   */
  async updateUser(user: User): Promise<User> {
    const { dispatch } = this;
    dispatch({ type: UPDATE_USER, payload: { user } });
    this.config.user = user;

    return user;
  }
}
