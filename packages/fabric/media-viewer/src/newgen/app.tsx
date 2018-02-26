import * as React from 'react';
import { createApp } from './create-app';
import * as MV from './media-viewer';

export const App = createApp<MV.Model, MV.Message, MV.Props>({
  initialMessage: MV.initialMessage,
  initialModel: MV.initialModel,
  update: MV.update,
  render: (dispatch: MV.DispatchFn, model: MV.Model) => (
    <MV.Component {...model} dispatch={dispatch} />
  ),
  effects: MV.effects,
});
