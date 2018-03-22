// @flow
import { Store, Unsubscribe } from 'redux';
import createStore from '../internal/store';
import type { State, Action, Handler } from '../internal/store';
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
} from '../internal/actions';
import type { Comment, Conversation, User } from '../model';
import { uuid } from '../internal/uuid';
import { HttpError } from './HttpError';

export type ConversationResourceConfig = {
  url: string,
  user?: User,
};

export interface ResourceProvider {
  +store: Store<State | typeof undefined>;
  getConversations(containerId: string): Promise<Conversation[]>;
  subscribe(handler: Handler): Unsubscribe;
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
    localId?: string,
  ): Promise<Comment>;
  updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<Comment>;
  deleteComment(
    conversationId: string,
    commentId: string,
  ): Promise<{
    conversationId: string,
    commentId: string,
    deleted?: boolean,
    error?: Error,
  }>;
  revertComment(
    conversationId: string,
    commentId: string,
  ): Promise<{ conversationId: string, commentId: string }>;
  updateUser(user?: User): Promise<User | typeof undefined>;
}

/* eslint-disable */
export class AbstractConversationResource implements ResourceProvider {
  _store: Store<State | typeof undefined>;

  // $FlowFixMe
  get store(): Store<State | typeof undefined> {
    return this._store;
  }

  dispatch = (action: Action) => {
    this.store.dispatch(action);
  };

  constructor() {
    this._store = createStore();
  }

  /**
   * Retrieve the IDs (and meta-data) for all conversations associated with the container ID.
   */
  getConversations(containerId: string): Promise<Conversation[]> {
    return Promise.reject('Not implemented');
  }

  /**
   * Subscribe to the provider's internal store
   * @param {Handler} handler
   */
  subscribe(handler: Handler): Unsubscribe {
    return this.store.subscribe(() => {
      const state = this.store.getState();
      handler(state);
    });
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
   * Adds a comment to a parent, or update if existing. ParentId can be either a conversation or another comment.
   */
  async addComment(
    conversationId: string,
    parentId: string,
    doc: any,
    localId?: string,
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
  ): Promise<{
    conversationId: string,
    commentId: string,
    deleted?: boolean,
    error?: Error,
  }> {
    return Promise.reject('Not implemented');
  }

  /**
   * Reverts a comment based on ID.
   */
  async revertComment(
    conversationId: string,
    commentId: string,
  ): Promise<{ conversationId: string, commentId: string }> {
    return Promise.reject('Not implemented');
  }

  /**
   * Updates a user in the store. Returns updated user
   */
  async updateUser(user?: User): Promise<User | typeof undefined> {
    return Promise.reject('Not implemented');
  }
}
/* eslint-enable */

export class ConversationResource extends AbstractConversationResource {
  config: ConversationResourceConfig;

  constructor(config: ConversationResourceConfig) {
    super();
    this.config = config;

    if (config.user) {
      this.updateUser(config.user);
    }
  }

  async _makeRequest(path: string, options: any = {}): Promise<any> {
    const { url } = this.config;
    const fetchOptions = {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const response = await fetch(`${url}${path}`, fetchOptions);

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText);
    }

    // Content deleted
    if (response.status === 204) {
      return {};
    }

    return response.json();
  }

  /**
   * Retrieve the IDs (and meta-data) for all conversations associated with the container ID.
   */
  async getConversations(containerId: string) {
    const { dispatch } = this;
    dispatch({ type: FETCH_CONVERSATIONS_REQUEST });

    const { values } = await this._makeRequest(
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
  ): Promise<Conversation | any> {
    const { dispatch } = this;
    const tempConversation = this.createConversation(
      localId,
      containerId,
      value,
      meta,
    );
    let result: Conversation;

    if (tempConversation) {
      dispatch({
        type: CREATE_CONVERSATION_REQUEST,
        payload: {
          ...tempConversation,
        },
      });
    }

    try {
      result = await this._makeRequest(
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
    } catch (error) {
      result = { ...tempConversation, error };
      dispatch({ type: CREATE_CONVERSATION_ERROR, payload: result });
      return (result: Conversation);
    }

    dispatch({
      type: CREATE_CONVERSATION_SUCCESS,
      payload: {
        ...result,
        localId,
      },
    });

    return {
      ...result,
      localId,
    };
  }

  /**
   * Adds a comment to a parent, or update if existing. ParentId can be either a conversation or another comment.
   */
  async addComment(
    conversationId: string,
    parentId: string,
    doc: any,
    localId?: string,
  ): Promise<Comment | any> {
    const { dispatch } = this;
    const tempComment = localId
      ? { conversationId, localId }
      : this.createComment(conversationId, parentId, doc);
    let result: Comment | any;

    dispatch({ type: ADD_COMMENT_REQUEST, payload: tempComment });

    try {
      result = await this._makeRequest(
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
    } catch (error) {
      result = { conversationId, parentId, document: doc, error };
      dispatch({ type: ADD_COMMENT_ERROR, payload: result });
      return result;
    }

    dispatch({
      type: ADD_COMMENT_SUCCESS,
      payload: {
        ...result,
        localId: tempComment.localId,
      },
    });

    return {
      ...result,
      localId: tempComment.localId,
    };
  }

  /**
   * Updates a comment based on ID. Returns updated content
   */
  async updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<Comment | any> {
    const { dispatch } = this;
    const tempComment = this.getComment(conversationId, commentId);
    let result: Comment | any;

    if (tempComment) {
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        payload: {
          ...tempComment,
          document: {
            adf: document,
          },
        },
      });
    }

    try {
      result = await this._makeRequest(
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
    } catch (error) {
      result = { conversationId, commentId, document, error };
      dispatch({ type: UPDATE_COMMENT_ERROR, payload: result });
      return result;
    }

    dispatch({ type: UPDATE_COMMENT_SUCCESS, payload: result });

    return result;
  }

  /**
   * Deletes a comment based on ID. Returns updated comment.
   */
  async deleteComment(
    conversationId: string,
    commentId: string,
  ): Promise<{
    conversationId: string,
    commentId: string,
    deleted?: boolean,
    error?: Error,
  }> {
    const { dispatch } = this;

    dispatch({
      type: DELETE_COMMENT_REQUEST,
      payload: { commentId, conversationId },
    });

    try {
      await this._makeRequest(
        `/conversation/${conversationId}/comment/${commentId}`,
        {
          method: 'DELETE',
        },
      );
    } catch (error) {
      const result = { conversationId, commentId, error };
      dispatch({ type: DELETE_COMMENT_ERROR, payload: result });
      return result;
    }

    const result = {
      conversationId,
      commentId,
      deleted: true,
    };

    dispatch({ type: DELETE_COMMENT_SUCCESS, payload: result });

    return result;
  }

  /**
   * Reverts a comment based on ID.
   */
  async revertComment(
    conversationId: string,
    commentId: string,
  ): Promise<{ conversationId: string, commentId: string }> {
    const { dispatch } = this;

    const comment = { conversationId, commentId };

    dispatch({ type: REVERT_COMMENT, payload: comment });

    return comment;
  }

  /**
   * Updates a user in the store. Returns updated user
   */
  async updateUser(user?: User): Promise<User | typeof undefined> {
    const { dispatch } = this;
    dispatch({ type: UPDATE_USER_SUCCESS, payload: { user } });

    return user;
  }

  /**
   * Internal helper methods for optimistic updates
   */
  createConversation(
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ): Conversation {
    return {
      localId,
      containerId,
      meta,
      conversationId: localId,
      comments: [this.createComment(localId, localId, value)],
    };
  }

  createComment(
    conversationId: string,
    parentId: string,
    doc: any,
    localId: string = ((uuid.generate(): any): string),
  ): Comment {
    return {
      createdBy: this.config.user,
      createdAt: Date.now(),
      commentId: ((uuid.generate(): any): string),
      document: {
        adf: doc,
      },
      conversationId,
      parentId,
      comments: [],
      localId,
    };
  }

  getComment(
    conversationId: string,
    commentId: string,
  ): Comment | typeof undefined {
    const { store } = this;
    const state = store.getState();

    if (!state) {
      return undefined;
    }

    const [conversation] = state.conversations.filter(
      c => c.conversationId === conversationId,
    );
    if (!conversation) {
      return undefined;
    }

    const [comment] = (conversation.comments || []).filter(
      c => c.commentId === commentId,
    );
    return {
      ...comment,
    };
  }
}
