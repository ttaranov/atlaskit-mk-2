import * as React from 'react';
import { Positioner } from './styled';
import { FilePreview } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';

export type Props = {
  previewData: FilePreview;
};

const ViewerSelector: React.StatelessComponent<Props> = ({ previewData }) => {
  switch(previewData.viewer) {
    case 'IMAGE':
      return (
        <ImageViewer previewData={previewData} />
      );
    case 'VIDEO':
      return (
        <VideoViewer previewData={previewData} />
      );
  }
};

export const FileViewer: React.StatelessComponent<Props> = ({
  previewData,
}) => (
  <Positioner>
    <ViewerSelector previewData={previewData} />
  </Positioner>
);
