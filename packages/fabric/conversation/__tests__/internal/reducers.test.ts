import { createStore } from '../../src/internal/store';
import { reducers } from '../../src/internal/reducers';
import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  CREATE_CONVERSATION_REQUEST,
  CREATE_CONVERSATION_SUCCESS,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
} from '../../src/internal/actions';

import {
  mockConversation,
  mockComment2,
  mockComment,
} from '../../example-helpers/MockData';

describe('Reducers', () => {
  describe('Fetch Conversations', () => {
    const store = createStore(reducers);
    const { dispatch } = store;

    it('should return initial state on REQUEST', () => {
      dispatch({
        type: FETCH_CONVERSATIONS_REQUEST,
      });

      expect(store.getState()).toEqual({
        conversations: [],
      });
    });

    it('should add conversations to state on SUCCESS', () => {
      dispatch({
        type: FETCH_CONVERSATIONS_SUCCESS,
        payload: mockConversation,
      });

      expect(store.getState()).toEqual({
        conversations: [mockConversation],
      });
    });
  });

  describe('Create Conversation', () => {
    const store = createStore(reducers);
    const { dispatch } = store;

    it('should optimistically add a conversation to state on REQUEST', () => {
      dispatch({
        type: CREATE_CONVERSATION_REQUEST,
        payload: mockConversation,
      });

      const [comment] = mockConversation.comments;

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...comment,
                state: 'SAVING',
              },
            ],
          },
        ],
      });
    });

    it('should remove SAVING state from comment on SUCCESS', () => {
      dispatch({
        type: CREATE_CONVERSATION_SUCCESS,
        payload: mockConversation,
      });

      expect(store.getState()).toEqual({
        conversations: [mockConversation],
      });
    });
  });

  describe('Add Comment', () => {
    const store = createStore(reducers, {
      conversations: [mockConversation],
    });
    const { dispatch } = store;

    it('should optimistically add a comment to conversation on REQUEST', () => {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        payload: mockComment2,
      });

      const { comments } = mockConversation;

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              ...comments,
              {
                ...mockComment2,
                state: 'SAVING',
              },
            ],
          },
        ],
      });
    });

    it('should remove SAVING state from comment on SUCCESS', () => {
      dispatch({
        type: ADD_COMMENT_SUCCESS,
        payload: mockComment2,
      });

      const { comments } = mockConversation;

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [...comments, mockComment2],
          },
        ],
      });
    });
  });

  describe('Update Comment', () => {
    const store = createStore(reducers, {
      conversations: [mockConversation],
    });
    const { dispatch } = store;

    it('should optimistically update the comment on REQUEST', () => {
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        payload: mockComment,
      });

      const [firstComment, ...otherComments] = mockConversation.comments;

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...firstComment,
                state: 'SAVING',
              },
              ...otherComments,
            ],
          },
        ],
      });
    });

    it('should remove SAVING state from comment on SUCCESS', () => {
      dispatch({
        type: UPDATE_COMMENT_SUCCESS,
        payload: mockComment,
      });

      expect(store.getState()).toEqual({
        conversations: [mockConversation],
      });
    });
  });

  describe('Delete Comment', () => {
    const store = createStore(reducers, {
      conversations: [mockConversation],
    });
    const { dispatch } = store;

    it('should mark comment as deleted on SUCCESS', () => {
      dispatch({
        type: DELETE_COMMENT_SUCCESS,
        payload: mockComment,
      });

      const [firstComment, ...otherComments] = mockConversation.comments;

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...firstComment,
                deleted: true,
              },
              ...otherComments,
            ],
          },
        ],
      });
    });
  });
});
