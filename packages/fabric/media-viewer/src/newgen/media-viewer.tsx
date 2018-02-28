import * as React from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Context } from '@atlaskit/media-core';
import {
  MediaViewerDataSource,
  MediaViewerItem,
} from '../components/media-viewer';
import * as Blanket from './blanket';

export type ImageResolution = 'small' | 'large';

export type Model =
  | {
      state: 'OPEN';
      name?: string;
      src?: string;
      imgResolution?: ImageResolution;
    }
  | {
      state: 'ERROR';
    };

export const initialModel: Model = {
  state: 'OPEN',
};

export type Message =
  | {
      type: 'INIT';
    }
  | {
      type: 'RECEIVED_ATTRIBUTES';
      name?: string;
    }
  | {
      type: 'RECEIVED_SRC';
      src: string;
      imgResolution: ImageResolution;
    }
  | {
      type: 'LOADING_FAILED';
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
    case 'RECEIVED_SRC':
      return {
        ...model,
        src: message.src,
        imgResolution: message.imgResolution,
      };
    case 'RECEIVED_ATTRIBUTES':
      return { ...model, name: message.name };
    case 'LOADING_FAILED':
      return { state: 'ERROR' };
    case 'CLOSE':
      return model;
  }
};

const ImageViewerWrapper = styled.div`
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type ImgProps = {
  showBlurred: boolean;
};
const Img = styled.img`
  max-height: 100%;
  transition: transform 0.3s;
  filter: ${(props: ImgProps) => (props.showBlurred ? 'blur(5px)' : 'none')};
`;

const ItemPreviewWrapper = styled.div`
  flex: 1;
  padding: 10px;
  overflow: hidden;
`;

const DetailsWrapper = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
`;

export const LeftInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  flex-grow: 1;
`;

const iconBaseStyle = `
  margin: 0 10px;
  border-radius: 5px;
  padding: 1px 3px;
  cursor: pointer;
  transition: background-color .3s;

  &:hover {
    background-color: #2B3955;
  }
`;

const RightIcons = styled.div`
  > span {
    ${iconBaseStyle} margin: 10px;
  }
`;

export type Props = {
  model: Model;
  dispatch: (message: Message) => void;
};

export const Component: React.StatelessComponent<Props> = ({
  model,
  dispatch,
}) => (
  <Blanket.Component onClick={() => dispatch({ type: 'CLOSE' })}>
    <DetailsWrapper>
      <LeftInfo>
        <span>
          {(model.state === 'OPEN' &&
            typeof model.name === 'string' &&
            (model.name || 'unknown')) ||
            ''}
        </span>
      </LeftInfo>
      <RightIcons>
        <CrossIcon label="close" onClick={() => dispatch({ type: 'CLOSE' })} />
      </RightIcons>
    </DetailsWrapper>
    <ItemPreviewWrapper>
      <ImageViewerWrapper>
        {model.state === 'ERROR' && <div>Something went wrong</div>}
        {model.state === 'OPEN' &&
          (model.src ? (
            <Img
              src={model.src}
              width={800}
              height={600}
              showBlurred={model.imgResolution === 'small'}
            />
          ) : (
            <Spinner size="large" />
          ))}
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
          next: async item => {
            dispatch({
              type: 'RECEIVED_ATTRIBUTES',
              name: item.type === 'file' ? item.details.name : void 0,
            });

            if (item.type === 'file') {
              if (item.details.processingStatus === 'succeeded') {
                try {
                  const service = context.getDataUriService(
                    cfg.collectionName,
                    true,
                  );
                  const uriSmall = service.fetchImageDataUri(item, {
                    width: 100,
                    height: 75,
                  });
                  const uriLarge = service.fetchImageDataUri(item, {
                    width: 800,
                    height: 600,
                  });
                  dispatch({
                    type: 'RECEIVED_SRC',
                    src: await uriSmall,
                    imgResolution: 'small',
                  });
                  dispatch({
                    type: 'RECEIVED_SRC',
                    src: await uriLarge,
                    imgResolution: 'large',
                  });
                } catch (e) {
                  dispatch({
                    type: 'LOADING_FAILED',
                  });
                }
              }
            }
          },
          error: err => {
            dispatch({
              type: 'LOADING_FAILED',
            });
          },
        });
      break;
    case 'CLOSE':
      if (cfg.onClose) {
        cfg.onClose();
      }
      break;
    default:
      break;
  }
};
