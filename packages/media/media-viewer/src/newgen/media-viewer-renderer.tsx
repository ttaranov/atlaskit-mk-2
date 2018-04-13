import * as React from 'react';
import AkSpinner from '@atlaskit/spinner';
import { FileViewer } from './file-viewer';
import { Blanket, Content, ErrorMessage } from './styled';
import { Model } from './domain';

export const Spinner: React.StatelessComponent<{}> = ({}) => (
  <AkSpinner invertColor size="large" />
);

export type Props = {
  model: Model;
  onClose?: () => void;
};

export const MediaViewerRenderer: React.StatelessComponent<Props> = ({
  model,
  onClose,
}) => (
  <Blanket onClick={onClose}>
    <Content>
      <Viewer model={model} />
    </Content>
  </Blanket>
);

export const Viewer: React.StatelessComponent<Props> = ({ model }) => {
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
