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
  const { fileDetails } = model;
  switch (fileDetails.status) {
    case 'PENDING':
      return <Spinner />;
    case 'SUCCESSFUL':
      return <FileViewer fileDetails={fileDetails.data} />;
    case 'FAILED':
      return <ErrorMessage>Error</ErrorMessage>;
  }
};
