import * as React from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';
import { Context } from '@atlaskit/media-core';
import {
  MediaViewerDataSource,
  MediaViewerItem,
} from '../components/media-viewer';
import * as Blanket from './blanket';
import * as ImageEditor from './image-editor';

export type Model =
  | {
      state: 'OPEN';
      name?: string;
      src?: string;
      editorMode: boolean;
      editor?: ImageEditor.Model;
    }
  | {
      state: 'ERROR';
    };

export const initialModel: Model = {
  state: 'OPEN',
  editorMode: false
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
    }
  | {
      type: 'LOADING_FAILED';
    }
  | {
      type: 'CLOSE';
    }
  | {
      type: 'CLOSE_ANNOTATIONS';
    }
  | {
      type: 'OPEN_ANNOTATIONS';
  }
  | {
    type: 'MEDIA_EDITOR_MESSAGE';
    refMessage: ImageEditor.Message;
};

export const initialMessage: Message = {
  type: 'INIT',
};

export const update = (model: Model, message: Message): Model => {
  switch (message.type) {
    case 'INIT':
      return model;
    case 'CLOSE_ANNOTATIONS':
      return model.state !== 'ERROR' ? { ...model, editorMode: false, editor: undefined } : model
    case 'OPEN_ANNOTATIONS':
      return model.state !== 'ERROR' ? { ...model, editorMode: true, editor: ImageEditor.initialModel(model.src) } : model;
    case 'RECEIVED_SRC':
      return model.state !== 'ERROR' ? { ...model, src: message.src } : model;
    case 'RECEIVED_ATTRIBUTES':
      return model.state !== 'ERROR' ? { ...model, name: message.name } : model;
    case 'LOADING_FAILED':
      return { state: 'ERROR' };
    case 'MEDIA_EDITOR_MESSAGE':     
      if (model.state !== 'ERROR' && model.editor) {
        const editorModel = ImageEditor.update(model.editor, message.refMessage);
        return  { ...model, editor: editorModel };  
      } else {
        return model;
      }
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

const Img = styled.img`
  max-height: 100%;
  transition: transform 0.3s;
`;

const ItemPreviewWrapper = styled.div`
  flex: 1;
  padding: 10px;
  overflow: hidden;
`;

const DetailsWrapper = styled.div`
  display: flex;
  position: absolute;
`;

export const LeftInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 20px;
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

type ImageContentProps = {
  model: Model;
  dispatch: (message: Message) => void; 
}

const ImageContent = ({ model, dispatch }: ImageContentProps) => {  
  if (model.state === 'ERROR') {
    return (
      <div>Something went wrong</div>
    );
  } else {
    if (!model.src) {
      return (
        <Spinner size="large" />
      );
    }    
    if (model.editor) {
      return (
        <div>
          <ImageEditor.Component 
            model={ model.editor } 
            dispatch={ (refMessage: ImageEditor.Message) => dispatch({ type: 'MEDIA_EDITOR_MESSAGE', refMessage }) }
          />
          <button style={{display: 'block'}} onClick={(e) => { e.stopPropagation(); dispatch({ type: 'CLOSE_ANNOTATIONS' })}}>close editor</button>
        </div>
      );
    } else {
      return (
        <div>
          <Img src={model.src} />
          <button style={{display: 'block'}} onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_ANNOTATIONS' })}}>open editor</button>
        </div>
      )
    }  
  }
};

export type Props = {
  model: Model;
  dispatch: (message: Message) => void;
};

export const Component: React.StatelessComponent<Props> = ({
  model,
  dispatch,
}) => (
  <Blanket.Component onClick={() => model.state === 'OPEN' && !model.editor && dispatch({ type: 'CLOSE' })}>
    <DetailsWrapper>
      <LeftInfo>
        <span>
          {(model.state === 'OPEN' &&
            typeof model.name === 'string' &&
            (model.name || 'unknown')) ||
            ''}
        </span>
      </LeftInfo>
      <RightIcons />
    </DetailsWrapper>
    <ItemPreviewWrapper>
      <ImageViewerWrapper>
          <ImageContent model={model} dispatch={dispatch} />
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
                  const service = context.getDataUriService(cfg.collectionName, true);
                  const uriSmall = service.fetchImageDataUri(item, {
                    width: 100,
                    height: 60,
                  });
                  const uriLarge = service.fetchImageDataUri(item, {
                    width: 800,
                    height: 600,
                  });
                  dispatch({
                    type: 'RECEIVED_SRC',
                    src: await uriSmall,
                  });
                  dispatch({
                    type: 'RECEIVED_SRC',
                    src: await uriLarge,
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
