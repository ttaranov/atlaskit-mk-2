import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { ErrorMessage } from './styled';
import { Model } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { PDFViewer } from './viewers/pdf';
import { Spinner } from './loading';

export type Props = {
  model: Model;
  onClose?: () => void;
  context: Context;
  item?: FileItem;
};

export const ItemViewer: React.StatelessComponent<Props> = ({
  model,
  item,
  context,
}) => {
  const { fileDetails } = model;

  switch (fileDetails.status) {
    case 'PENDING':
      return <Spinner />;
    case 'SUCCESSFUL':
      if (!item) {
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
