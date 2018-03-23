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
  switch (model.type) {
    case 'LOADING':
      return <Spinner />;
    case 'SUCCESS':
      return <FileViewer fileDetails={model.item} />;
    case 'FAILED':
      return <ErrorMessage>Error</ErrorMessage>;
  }
};
