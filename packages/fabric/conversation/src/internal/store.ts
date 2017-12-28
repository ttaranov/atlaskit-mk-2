import { Conversation } from '../model';

export interface Store {
  getState(): undefined | any;
  dispatch(action: Action): void;
  subscribe(handler: any): void;
}

export interface State {
  conversations: Conversation[];
}

export interface Action {
  type: string;
  payload?: any;
}

export type Dispatch = (action: Action) => void;

export const createStore = reducer => {
  let subscribers: any[] = [];
  let state = {
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

    subscribe(handler: any) {
      subscribers.push(handler);
    },

    unsubscribe(handler: any) {
      subscribers = subscribers.filter(h => h !== handler);
    },
  };
};
