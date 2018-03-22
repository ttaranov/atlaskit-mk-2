import * as React from 'react';
import { Positioner } from './styled';
import { FilePreview } from './domain';

export type Props = {
  previewData: FilePreview;
};

const ViewerSelector: React.StatelessComponent<Props> = ({ previewData }) => {
  return (
    <img src={previewData.objectUrl} />
  )
};

export const FileViewer: React.StatelessComponent<Props> = ({
  previewData,
}) => (
  <Positioner>
    <ViewerSelector previewData={previewData} />
  </Positioner>
);
