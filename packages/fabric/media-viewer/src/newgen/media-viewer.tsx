import * as React from 'react';
import { createApp } from './create-app';
import { Context, MediaItem } from '@atlaskit/media-core';
import { MediaViewerDataSource, MediaViewerItem } from '../components/media-viewer';
// initState: State;
// reducer: (prevState: State, action: Action) => State;
// render: (dispatch: (action: Action) => void, state: State) => any;

export interface Props {
  context: Context;
  dataSource: MediaViewerDataSource;
  initialItem: MediaViewerItem;
  collectionName?: string;
}

export type State = {
  type: 'LOADING'
} | {
  type: 'LOADED',
  name: string
} | {
  type: 'ERROR'
}

export type Action = { 
  type: 'INIT',
  props: Props
} | {
  type: 'LOADED',
  item: MediaItem
} | {
  type: 'LOADING_ERROR',
};

const initialState: State = {
  type: 'LOADING'
};

const initialAction = (props: Props): Action => {
  return {
    type: 'INIT',
    props
  };
}

const reducer = (prevState: State, action: Action): State => {
  switch(action.type) {
    case 'LOADED':
      return {
        type: 'LOADED',
        name: action.item.type === 'file' && action.item.details.name || 'unkown'
      };
    case 'INIT':
      return prevState;
    case  'LOADING_ERROR':
      return {
        type: 'ERROR'
      }
  }
};

const render = (dispatch: (action: Action) => void, state: State) => {
  switch(state.type) {
    case 'LOADING':
      return (
        <div>..spinner..</div>
      );
    case 'ERROR':
      return (
        <div>ERROR view</div>
      );
    case 'LOADED':
    return (
      <div>{state.name}</div>
    );    
  }
};

const effects = (action: Action): Promise<Action> | null => {
  switch (action.type) {
    case 'INIT': 
      return new Promise((resolve, reject) => {
        const { props } = action;
        const { context } = props;
        context.getMediaItemProvider(
          props.initialItem.id, 
          props.initialItem.type, 
          props.collectionName).observable().subscribe({
            next: (item) => {
              resolve({
                type: 'LOADED',
                item
              })      
            },
            error: (err) => {
              resolve({
                type: 'LOADING_ERROR'
              });
            }
        });  
      });
    default: 
      return null;
  }
};

export const App = createApp<State, Action, Props>({
  initialAction,
  initialState,
  reducer,
  render,
  effects
});