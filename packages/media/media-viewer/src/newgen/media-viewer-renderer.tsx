import * as React from 'react';
import { StatelessComponent } from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { Blanket, Header, Content, ErrorMessage } from './styled';
import { Model } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { PDFViewer } from './viewers/pdf';
import { Spinner } from './loading';

export type Props = {
  model: Model;
  onClose?: () => void;
  context?: Context;
  item?: FileItem;
};

export const MediaViewerRenderer: StatelessComponent<Props> = ({
  model,
  onClose,
  context,
  item,
}) => (
  <Blanket onClick={onClose}>
    {model.fileDetails.status === 'SUCCESSFUL' && (
      <Header>{model.fileDetails.data.name || 'No name given'}</Header>
    )}
    <Content>
      <Viewer model={model} context={context} item={item} />
    </Content>
  </Blanket>
);

export const Viewer: StatelessComponent<Props> = ({ model, item, context }) => {
  const { fileDetails } = model;

  switch (fileDetails.status) {
    case 'PENDING':
      return <Spinner />;
    case 'SUCCESSFUL':
      if (!(context && item)) {
        return <Spinner />;
      }
      switch (item.details.mediaType) {
        case 'image':
          return <ImageViewer context={context} item={item} />;
        case 'audio':
        case 'video':
          return <VideoViewer context={context} item={item} />;
        case 'doc':
          return <PDFViewer context={context} item={item} />;
        default:
          return <ErrorMessage>This file is unsupported</ErrorMessage>;
      }
    case 'FAILED':
      return <ErrorMessage>Error</ErrorMessage>;
  }
};
