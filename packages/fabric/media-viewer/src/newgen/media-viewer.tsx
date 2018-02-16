import * as React from 'react';
import { Context, MediaItem } from '@atlaskit/media-core';
import { MediaViewerDataSource, MediaViewerItem } from '../components/media-viewer';

export type DispatchFn = (action: Action) => void;

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

export const initialState: State = {
  type: 'LOADING'
};

export const initialAction = (props: Props): Action => {
  return {
    type: 'INIT',
    props
  };
}

export const reducer = (prevState: State, action: Action): State => {
  switch(action.type) {
    case 'INIT':
      return prevState;
    case 'LOADED':
      return {
        type: 'LOADED',
        name: action.item.type === 'file' && action.item.details.name || 'unkown'
      };
    case  'LOADING_ERROR':
      return {
        type: 'ERROR'
      }
  }
};

export type ComponentProps = State & { dispatch: DispatchFn };

export const Spinner = () => {
  return <div>spinner</div>;
}

export const Component = (props: ComponentProps) => {
  switch(props.type) {
    case 'LOADING':
      return (
        <Spinner/>
      );
    case 'ERROR':
      return (
        <div>ERROR view</div>
      );
    case 'LOADED':
    return (
      <div>{props.name}</div>
    );    
  }
};

export const effects = (action: Action): Promise<Action> | null => {
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
