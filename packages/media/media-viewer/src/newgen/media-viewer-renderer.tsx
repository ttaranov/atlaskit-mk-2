import * as React from 'react';
import Spinner from '@atlaskit/spinner';
import { FileViewer } from './file-viewer';
import { ErrorMessage } from './styled';
import { Model } from './domain';

export type Props = {
  model: Model;
};

export const MediaViewerRenderer: React.StatelessComponent<Props> = ({
  model,
}) => {
  const { fileDetails, previewData } = model;
  switch (fileDetails.status) {
    case 'PENDING':
      return <Spinner />;
    case 'SUCCESSFUL':
      if (fileDetails.data.mediaType === 'unknown') {
        return <ErrorMessage>This file is unsupported</ErrorMessage>;
      }
      if (previewData.status === 'SUCCESSFUL') {
        return <FileViewer previewData={previewData.data} />;
      } else if (previewData.status === 'PENDING') {
        return <Spinner />;
      } else {
        return <ErrorMessage>Error rendering preview</ErrorMessage>;
      }
    case 'FAILED':
      return <ErrorMessage>Error</ErrorMessage>;
  }
};
