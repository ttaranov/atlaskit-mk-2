import * as React from 'react';
import { createApp } from './create-app';
import * as MV from './media-viewer';

export const App = createApp<MV.Model, MV.Message, MV.Props>({
  initialMessage: MV.initialMessage,
  initialModel: MV.initialModel,
  update: MV.update,
  render: (props: { dispatch: MV.DispatchFn; model: MV.Model }) => (
    <MV.Component model={props.model} dispatch={props.dispatch} />
  ),
  effects: MV.effects,
});
