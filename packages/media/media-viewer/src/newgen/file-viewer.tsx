import * as React from 'react';
import { Positioner, ErrorMessage } from './styled';
import { FileDetails, ImageDetails } from './domain';
import { ImageViewer } from './image-viewer';

export type Props = {
  fileDetails: FileDetails;
};

const ViewerSelector: React.StatelessComponent<Props> = ({ fileDetails }) => {
  console.log('fileDetails', fileDetails);
  switch (fileDetails.mediaType) {
    case 'image':
      return <ImageViewer image={fileDetails as ImageDetails}/>;
    default:
      return <ErrorMessage>The current file type is unsupported.</ErrorMessage>;
  }
};

export const FileViewer: React.StatelessComponent<Props> = ({
  fileDetails,
}) => (
  <Positioner>
    <ViewerSelector fileDetails={fileDetails} />
  </Positioner>
);
