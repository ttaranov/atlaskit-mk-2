import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { Context, MediaItem } from '@atlaskit/media-core';
import {
  MediaViewerDataSource,
  MediaViewerItem,
} from '../components/media-viewer';

export type Config = {
  context: Context;
  dataSource: MediaViewerDataSource;
  initialItem: MediaViewerItem;
  collectionName?: string;
};

export type Model =
  | {
      state: 'LOADING';
    }
  | {
      state: 'LOADED';
      name: string;
      src: string;
    }
  | {
      state: 'ERROR';
    };

export const initialModel = (cfg: Config): Model => ({
  state: 'LOADING',
});

export type Message =
  | {
      type: 'INIT';
      cfg: Config;
    }
  | {
      type: 'LOADED';
      item: MediaItem;
      src: string;
    }
  | {
      type: 'LOADING_ERROR';
    };

export const initialMessage = (cfg: Config): Message => {
  return {
    type: 'INIT',
    cfg,
  };
};

export const update = (model: Model, message: Message): Model => {
  switch (message.type) {
    case 'INIT':
      return model;
    case 'LOADED':
      return {
        state: 'LOADED',
        name:
          (message.item.type === 'file' && message.item.details.name) ||
          'unkown',
        src: message.src,
      };
    case 'LOADING_ERROR':
      return {
        state: 'ERROR',
      };
  }
};

export const effects = (message: Message): Promise<Message> | null => {
  switch (message.type) {
    case 'INIT':
      return new Promise<Message>((resolve, reject) => {
        const { cfg } = message;
        const { context } = cfg;
        context
          .getMediaItemProvider(
            cfg.initialItem.id,
            cfg.initialItem.type,
            cfg.collectionName,
          )
          .observable()
          .subscribe({
            next: item => {
              context
                .getDataUriService(cfg.collectionName)
                .fetchImageDataUri(item, { width: 100, height: 100 })
                .then(
                  uri => {
                    resolve({
                      type: 'LOADED',
                      item,
                      src: uri,
                    });
                  },
                  err => {
                    resolve({
                      type: 'LOADING_ERROR',
                    });
                  },
                );
            },
            // complete
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

export type Props = {
  model: Model;
  dispatch: (message: Message) => void;
};

export const Component: React.StatelessComponent<Props> = ({ model }) => {
  switch (model.state) {
    case 'LOADING':
      return <Spinner />;
    case 'ERROR':
      return <div>ERROR view</div>;
    case 'LOADED':
      // loaded means that we have a list of media items to start with.
      // those items doesn't necessarily mean that have been completely loaded.
      return (
        <div>
          <h2>{model.name}</h2>
          <img src={model.src} />
        </div>
      );
  }
};
