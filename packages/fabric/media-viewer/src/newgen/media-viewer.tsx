import * as React from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';
import { Context, MediaItem } from '@atlaskit/media-core';
import {
  MediaViewerDataSource,
  MediaViewerItem,
} from '../components/media-viewer';
import * as Blanket from './blanket';

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

export const initialModel: Model = {
  state: 'LOADING',
};

export type Message =
  | {
      type: 'INIT';
    }
  | {
      type: 'LOADED';
      item: MediaItem;
      src: string;
    }
  | {
      type: 'LOADING_ERROR';
    }
  | {
      type: 'CLOSE';
    };

export const initialMessage: Message = {
  type: 'INIT',
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
    case 'CLOSE':
      return model;
  }
};

export type Props = {
  model: Model;
  dispatch: (message: Message) => void;
};

export const ImageViewerWrapper = styled.div`
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Img = styled.img`
  max-height: 100%;
  transition: transform 0.3s;
`;

export const ItemPreviewWrapper = styled.div`
  flex: 1;
  padding: 10px;
  overflow: hidden;
`;

export const Component: React.StatelessComponent<Props> = ({
  model,
  dispatch,
}) => (
  <Blanket.Component onClick={() => dispatch({ type: 'CLOSE' })}>
    <h2>{model.state === 'LOADED' && model.name}</h2>
    <ItemPreviewWrapper>
      <ImageViewerWrapper>
        {model.state === 'LOADING' ? (
          <Spinner size="large" />
        ) : model.state === 'ERROR' ? (
          <div>Something went wrong</div>
        ) : (
          <Img src={model.src} />
        )}
      </ImageViewerWrapper>
    </ItemPreviewWrapper>
  </Blanket.Component>
);

export type Config = {
  context: Context;
  dataSource: MediaViewerDataSource;
  initialItem: MediaViewerItem;
  collectionName?: string;
  onClose?: () => void;
};

export const effects = (
  cfg: Config,
  dispatch: (message: Message) => void,
  message: Message,
): void => {
  switch (message.type) {
    case 'INIT':
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
              .fetchImageDataUri(item, { width: 800, height: 600 })
              .then(
                uri => {
                  dispatch({
                    type: 'LOADED',
                    item,
                    src: uri,
                  });
                },
                err => {
                  dispatch({
                    type: 'LOADING_ERROR',
                  });
                },
              );
          },
          // TODO: add "complete" handler
          error: err => {
            dispatch({
              type: 'LOADING_ERROR',
            });
          },
        });
      break;
    case 'CLOSE':
      cfg.onClose && cfg.onClose();
      break;
    default:
      break;
  }
};
