import { createStore } from '../../src/internal/store';
import { FETCH_CONVERSATIONS_SUCCESS } from '../../src/internal/actions';
import { mockConversation } from '../../example-helpers/MockData';

const reducers = {
  [FETCH_CONVERSATIONS_SUCCESS]: jest.fn((state, action) => ({
    ...state,
    conversations: [action.payload],
  })),
};

describe('Store', () => {
  const store = createStore(reducers);
  const handler = jest.fn(() => {});

  store.subscribe(handler as any);

  describe('getState', () => {
    it('should return current state', () => {
      expect(store.getState()).toEqual({ conversations: [] });
    });
  });

  describe('dispatch', () => {
    it('should update state with result from reducer and call subscribers', () => {
      store.dispatch({
        type: FETCH_CONVERSATIONS_SUCCESS,
        payload: [mockConversation],
      });

      expect(reducers[FETCH_CONVERSATIONS_SUCCESS]).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledWith(store.getState());
    });
  });
});
