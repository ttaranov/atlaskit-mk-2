import * as React from 'react';
import { Positioner, ErrorMessage } from './styled';
import { FileDetails } from './domain';

export type Props = {
  fileDetails: FileDetails;
};

const ViewerSelector: React.StatelessComponent<Props> = ({ fileDetails }) => {
  switch (fileDetails.mediaType) {
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
