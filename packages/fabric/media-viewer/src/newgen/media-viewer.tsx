import * as React from 'react';
import { createApp } from './create-app';
import { Context } from '@atlaskit/media-core';
import { MediaViewerDataSource, MediaViewerItem } from '../components/media-viewer';
// initState: State;
// reducer: (prevState: State, action: Action) => State;
// render: (dispatch: (action: Action) => void, state: State) => any;

export interface Props {
  context: Context;
  dataSource: MediaViewerDataSource;
  selectedItem: MediaViewerItem;
}

export interface State {

}

export interface Action {

}

const initialState: State = {

};

const reducer = (prevState: State, action: Action): State => {

  return prevState;
};

const render = (dispatch: (action: Action) => void, state: State, props: Props) => {
  return (
    <div>{props.selectedItem.id}</div>
  );
}

export const App = createApp<State, Action, Props>({
  initialState,
  reducer,
  render
});