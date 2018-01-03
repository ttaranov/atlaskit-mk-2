import { Conversation } from '../model';

export interface Store {
  getState(): undefined | State;
  dispatch(action: Action): void;
  subscribe(handler: Handler): void;
}

export interface State {
  conversations: Conversation[];
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

export const createStore = (reducer: Reducer) => {
  let subscribers: Handler[] = [];
  let state: State = {
    conversations: [],
  };

  return {
    getState() {
      return state;
    },

    dispatch(action: Action) {
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
