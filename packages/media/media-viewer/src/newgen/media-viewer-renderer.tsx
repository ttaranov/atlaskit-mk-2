import * as React from 'react';
import { StatelessComponent } from 'react';
import AkSpinner from '@atlaskit/spinner';
import { Context, FileItem } from '@atlaskit/media-core';
import { Blanket, Header, Content, ErrorMessage } from './styled';
import { Model, FilePreview } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { PDFViewer } from './viewers/pdf';

export const Spinner: StatelessComponent<{}> = ({}) => (
  <AkSpinner invertColor size="large" />
);

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
  const { fileDetails, previewData } = model;

  switch (fileDetails.status) {
    case 'PENDING':
      return <Spinner />;
    case 'SUCCESSFUL':
      if (fileDetails.data.mediaType === 'unknown') {
        return <ErrorMessage>This file is unsupported</ErrorMessage>;
      }
      if (previewData.status === 'SUCCESSFUL') {
        return (
          <FileViewer
            previewData={previewData.data}
            context={context}
            item={item}
          />
        );
      } else if (previewData.status === 'PENDING') {
        return <Spinner />;
      } else {
        return <ErrorMessage>Error rendering preview</ErrorMessage>;
      }
    case 'FAILED':
      return <ErrorMessage>Error</ErrorMessage>;
  }
};

export type FileViewerProps = {
  previewData: FilePreview;
  context?: Context;
  item?: FileItem;
};

export const FileViewer: StatelessComponent<FileViewerProps> = ({
  previewData,
  context,
  item,
}) => {
  if (!(context && item)) {
    return <Spinner />;
  }
  switch (previewData.viewer) {
    case 'IMAGE':
      return <ImageViewer context={context} item={item} />;
    case 'VIDEO':
      return (
        <VideoViewer context={context} item={item} previewData={previewData} />
      );
    case 'PDF':
      return (
        <PDFViewer context={context} item={item} previewData={previewData} />
      );
  }
};
