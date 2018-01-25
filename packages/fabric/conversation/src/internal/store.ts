import { Conversation, User } from '../model';

export interface Store {
  getState(): undefined | State;
  dispatch(action: Action): void;
  subscribe(handler: Handler): void;
}

export interface State {
  conversations: Conversation[];
  user?: User;
}

export interface Action {
  type: string;
  payload?: any;
}

export type Dispatch = (action: Action) => void;
export type Handler = (state: State) => void;
export interface Reducer {
  [key: string]: (state: State, action: Action) => State;
}

export const createStore = (
  reducer: Reducer,
  initialState: State = { conversations: [] },
) => {
  let subscribers: Handler[] = [];
  let state: State = initialState;

  return {
    getState() {
      return state;
    },

    dispatch(action: Action) {
      if (!reducer[action.type]) {
        return;
      }

      state = reducer[action.type](state, action);
      subscribers.forEach(cb => cb(state));
    },

    subscribe(handler: Handler) {
      subscribers.push(handler);
    },

    unsubscribe(handler: Handler) {
      subscribers = subscribers.filter(h => h !== handler);
    },
  };
};
