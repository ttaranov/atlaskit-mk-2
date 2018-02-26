import * as React from 'react';
import { Context, MediaItem } from '@atlaskit/media-core';
import {
  MediaViewerDataSource,
  MediaViewerItem,
} from '../components/media-viewer';
import Spinner from '@atlaskit/spinner';

export type DispatchFn = (message: Message) => void;

export interface Props {
  context: Context;
  dataSource: MediaViewerDataSource;
  initialItem: MediaViewerItem;
  collectionName?: string;
}
// model - and props alawys model, dispatch!
export type State =
  | {
      type: 'LOADING';
    }
  | {
      type: 'LOADED';
      name: string;
    }
  | {
      type: 'ERROR';
    };

export type Message =
  | {
      type: 'INIT';
      props: Props;
    }
  | {
      type: 'LOADED';
      item: MediaItem;
    }
  | {
      type: 'LOADING_ERROR';
    };

export const initialState: State = {
  type: 'LOADING',
};

// better name, e.g. init? -> takes props, can return message / model?
export const initialMessage = (props: Props): Message => {
  return {
    type: 'INIT',
    props,
  };
};

export const update = (prevState: State, message: Message): State => {
  switch (message.type) {
    case 'INIT':
      return prevState;
    case 'LOADED':
      return {
        type: 'LOADED',
        name:
          (message.item.type === 'file' && message.item.details.name) ||
          'unkown',
      };
    case 'LOADING_ERROR':
      return {
        type: 'ERROR',
      };
  }
};

export type ComponentProps = State & { dispatch: DispatchFn };

export const Component = (props: ComponentProps) => {
  switch (props.type) {
    case 'LOADING':
      return <Spinner />;
    case 'ERROR':
      return <div>ERROR view</div>;
    case 'LOADED':
      // loaded means that we have a list of media items to start with.
      // those items doesn't necessarily mean that have been completely loaded.

      return <div>{props.name}</div>;
  }
};

export const effects = (message: Message): Promise<Message> | null => {
  switch (message.type) {
    case 'INIT':
      return new Promise((resolve, reject) => {
        const { props } = message;
        const { context } = props;
        context
          .getMediaItemProvider(
            props.initialItem.id,
            props.initialItem.type,
            props.collectionName,
          )
          .observable()
          .subscribe({
            next: item => {
              resolve({
                type: 'LOADED',
                item,
              });
            },
            error: err => {
              resolve({
                type: 'LOADING_ERROR',
              });
            },
          });
      });
    default:
      return null;
  }
};
