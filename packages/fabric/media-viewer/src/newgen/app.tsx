import { createApp } from './create-app';
import * as MV from './media-viewer';

export const App = createApp<MV.Model, MV.Message, MV.Config>({
  initialModel: MV.initialModel,
  initialMessage: MV.initialMessage,
  update: MV.update,
  effects: MV.effects,
  Component: MV.Component,
});
