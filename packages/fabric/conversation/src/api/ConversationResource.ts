import { createStore, Store, Action } from '../internal/store';
import {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT_SUCCESS,
  UPDATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  UPDATE_USER,
  CREATE_CONVERSATION_SUCCESS,
} from '../internal/actions';
import { reducers } from '../internal/reducers';
import { Comment, Conversation, User } from '../model';

export interface ConversationResourceConfig {
  url: string;
  user?: User;
}

export interface ResourceProvider {
  getConversations(containerId: string): Promise<Conversation[]>;
  create(
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ): Promise<Conversation>;
  addComment(
    conversationId: string,
    parentId: string,
    document: any,
  ): Promise<Comment>;
  updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<Comment>;
  deleteComment(
    conversationId: string,
    commentId: string,
  ): Promise<Pick<Comment, 'conversationId' | 'commentId' | 'deleted'>>;
  updateUser(user: User): Promise<User>;
}

export class AbstractConversationResource implements ResourceProvider {
  private _store: Store;

  get store() {
    return this._store;
  }

  dispatch = (action: Action) => {
    this.store.dispatch(action);
  };

  constructor() {
    this._store = createStore(reducers);
  }

  /**
   * Retrieve the IDs (and meta-data) for all conversations associated with the container ID.
   */
  getConversations(containerId: string): Promise<Conversation[]> {
    return Promise.reject('Not implemented');
  }

  /**
   * Creates a new Conversation and associates it with the containerId provided.
   */
  create(
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ): Promise<Conversation> {
    return Promise.reject('Not implemented');
  }

  /**
   * Adds a comment to a parent. ParentId can be either a conversation or another comment.
   */
  async addComment(
    conversationId: string,
    parentId: string,
    doc: any,
  ): Promise<Comment> {
    return Promise.reject('Not implemented');
  }

  /**
   * Updates a comment based on ID. Returns updated content
   */
  async updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<Comment> {
    return Promise.reject('Not implemented');
  }

  /**
   * Deletes a comment based on ID. Returns updated comment.
   */
  async deleteComment(
    conversationId: string,
    commentId: string,
  ): Promise<Pick<Comment, 'conversationId' | 'commentId' | 'deleted'>> {
    return Promise.reject('Not implemented');
  }

  /**
   * Updates a user in the store. Returns updated user
   */
  async updateUser(user: User): Promise<User> {
    return Promise.reject('Not implemented');
  }
}

export class ConversationResource extends AbstractConversationResource {
  private config: ConversationResourceConfig;

  constructor(config: ConversationResourceConfig) {
    super();
    this.config = config;

    if (config.user) {
      this.updateUser(config.user);
    }
  }

  private async makeRequest<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const { url } = this.config;
    const fetchOptions = {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const response = await fetch(`${url}${path}`, fetchOptions as any);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // Content deleted
    if (response.status === 204) {
      return <T>{};
    }

    return await response.json();
  }

  /**
   * Retrieve the IDs (and meta-data) for all conversations associated with the container ID.
   */
  async getConversations(containerId: string) {
    const { dispatch } = this;
    dispatch({ type: FETCH_CONVERSATIONS });

    const { values } = await this.makeRequest<{ values: Conversation[] }>(
      `/conversation?containerId=${containerId}&expand=comments.document.adf`,
      {
        method: 'GET',
      },
    );

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
    const result = await this.makeRequest<Conversation>(
      '/conversation?expand=comments.document.adf',
      {
        method: 'POST',
        body: JSON.stringify({
          containerId,
          meta,
          comment: {
            document: {
              adf: value,
            },
          },
        }),
      },
    );

    result.localId = localId;

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
    const result = await this.makeRequest<Comment>(
      `/conversation/${conversationId}/comment?expand=document.adf`,
      {
        method: 'POST',
        body: JSON.stringify({
          parentId,
          document: {
            adf: doc,
          },
        }),
      },
    );

    const { dispatch } = this;
    dispatch({ type: ADD_COMMENT_SUCCESS, payload: result });

    return result;
  }

  /**
   * Updates a comment based on ID. Returns updated content
   */
  async updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<Comment> {
    const result = await this.makeRequest<Comment>(
      `/conversation/${conversationId}/comment/${commentId}?expand=document.adf`,
      {
        method: 'PUT',
        body: JSON.stringify({
          id: commentId,
          document: {
            adf: document,
          },
        }),
      },
    );

    const { dispatch } = this;
    dispatch({ type: UPDATE_COMMENT_SUCCESS, payload: result });

    return result;
  }

  /**
   * Deletes a comment based on ID. Returns updated comment.
   */
  async deleteComment(
    conversationId: string,
    commentId: string,
  ): Promise<Pick<Comment, 'conversationId' | 'commentId' | 'deleted'>> {
    await this.makeRequest<{}>(
      `/conversation/${conversationId}/comment/${commentId}`,
      {
        method: 'DELETE',
      },
    );

    const result = {
      conversationId,
      commentId,
      deleted: true,
    };

    const { dispatch } = this;
    dispatch({ type: DELETE_COMMENT_SUCCESS, payload: result });

    return result;
  }

  /**
   * Updates a user in the store. Returns updated user
   */
  async updateUser(user: User): Promise<User> {
    const { dispatch } = this;
    dispatch({ type: UPDATE_USER, payload: { user } });

    return user;
  }
}
