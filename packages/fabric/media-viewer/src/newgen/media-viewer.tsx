import * as React from 'react';
import { Context, MediaItem } from '@atlaskit/media-core';
import {
  MediaViewerDataSource,
  MediaViewerItem,
} from '../components/media-viewer';
import Spinner from '@atlaskit/spinner';

export interface Props {
  context: Context;
  dataSource: MediaViewerDataSource;
  initialItem: MediaViewerItem;
  collectionName?: string;
}

export type Model =
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

export const initialModel: Model = {
  type: 'LOADING',
};

// better name, e.g. init? -> takes props, can return message / model?
export const initialMessage = (props: Props): Message => {
  return {
    type: 'INIT',
    props,
  };
};

export const update = (model: Model, message: Message): Model => {
  switch (message.type) {
    case 'INIT':
      return model;
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

export type DispatchFn = (message: Message) => void;
export type ComponentProps = { model: Model } & { dispatch: DispatchFn };
export const Component = ({ model }: ComponentProps) => {
  switch (model.type) {
    case 'LOADING':
      return <Spinner />;
    case 'ERROR':
      return <div>ERROR view</div>;
    case 'LOADED':
      // loaded means that we have a list of media items to start with.
      // those items doesn't necessarily mean that have been completely loaded.
      return <div>{model.name}</div>;
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
