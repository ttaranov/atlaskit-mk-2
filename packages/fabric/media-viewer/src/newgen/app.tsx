import * as React from 'react';
import { createApp } from './create-app';
import * as MV from './media-viewer';

export const App = createApp<MV.State, MV.Action, MV.Props>({
  initialAction: MV.initialAction,
  initialState: MV.initialState,
  reducer: MV.reducer,
  render: (dispatch: MV.DispatchFn, state: MV.State) => <MV.Component {...state} dispatch={dispatch} />,
  effects: MV.effects
});