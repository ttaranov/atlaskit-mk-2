// @flow
import { createStore as createReduxStore, Store, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducers } from './reducers';

import type { Conversation, User } from '../model';

export type State = {
  conversations: Conversation[],
  user?: User,
};

export type Action = {
  type: string,
  payload?: any,
};

export type Handler = (state?: State) => void;

export default function createStore(
  initialState?: State,
): Store<State | typeof undefined> {
  return createReduxStore(reducers, initialState, applyMiddleware(thunk));
}
