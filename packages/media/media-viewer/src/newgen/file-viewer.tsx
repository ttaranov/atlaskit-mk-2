import * as React from 'react';
import { Positioner, ErrorMessage } from './styled';
import { DocumentViewer } from './document-viewer';
import { MediaType } from '@atlaskit/media-core';

export type FileDetails = {
  mediaType: MediaType;
};

export type Props = {
  fileDetails: FileDetails;
};

export const FileViewer: React.StatelessComponent<Props> = ({ fileDetails }) => (
  <Positioner>
    {fileDetails.mediaType === 'doc' && <DocumentViewer />}
    {fileDetails.mediaType === 'unknown' && <ErrorMessage>The current file type is unsupported.</ErrorMessage>}
  </Positioner>
);