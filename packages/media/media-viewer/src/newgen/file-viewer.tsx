import * as React from 'react';
import { FilePreview } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { PDFViewer } from './viewers/pdf';

export type Props = {
  previewData: FilePreview;
};

const ViewerSelector: React.StatelessComponent<Props> = ({ previewData }) => {
  switch (previewData.viewer) {
    case 'IMAGE':
      return <ImageViewer previewData={previewData} />;
    case 'VIDEO':
      return <VideoViewer previewData={previewData} />;
    case 'PDF':
      return <PDFViewer previewData={previewData} />;
  }
};

export const FileViewer: React.StatelessComponent<Props> = ({
  previewData,
}) => <ViewerSelector previewData={previewData} />;
