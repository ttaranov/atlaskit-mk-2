import * as React from 'react';
import { Positioner, ErrorMessage } from './styled';
import { DocumentViewer } from './document-viewer';
import { ImageViewer } from './image-viewer';
import { FileDetails, ImageDetails } from './domain';

export type Props = {
  fileDetails: FileDetails;
};

const ViewerSelector: React.StatelessComponent<Props> = ({ fileDetails }) => {
  switch(fileDetails.mediaType) {
    case 'image':
      return <ImageViewer image={fileDetails as ImageDetails}/>;
    case 'doc':
      return <DocumentViewer />;
    default:
      return <ErrorMessage>The current file type is unsupported.</ErrorMessage>;
  }
};

export const FileViewer: React.StatelessComponent<Props> = ({ fileDetails }) => (
  <Positioner>
    <ViewerSelector fileDetails={fileDetails} />
  </Positioner>
);