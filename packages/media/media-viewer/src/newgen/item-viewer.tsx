import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { ErrorMessage } from './styled';
import { Outcome } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { PDFViewer } from './viewers/pdf';
import { Spinner } from './loading';

export type Props = {
  item: Outcome<FileItem, Error>;
  context: Context;
};

export const ItemViewer: React.StatelessComponent<Props> = ({
  item,
  context,
}) => {
  switch (item.status) {
    case 'PENDING':
      return <Spinner />;
    case 'SUCCESSFUL':
      const itemUnwrapped = item.data;
      switch (itemUnwrapped.details.mediaType) {
        case 'image':
          return <ImageViewer context={context} item={itemUnwrapped} />;
        case 'audio':
        case 'video':
          return <VideoViewer context={context} item={itemUnwrapped} />;
        case 'doc':
          return <PDFViewer context={context} item={itemUnwrapped} />;
        default:
          return <ErrorMessage>This file is unsupported</ErrorMessage>;
      }
    case 'FAILED':
      return <ErrorMessage>Error</ErrorMessage>;
  }
};
