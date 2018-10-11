import * as React from 'react';
import { Context, FileState, isErrorFileState } from '@atlaskit/media-core';
import { DownloadButtonWrapper } from '../styled';
import Button from '@atlaskit/button';

export const createItemDownloader = (
  file: FileState,
  context: Context,
  collectionName?: string,
) => () => {
  const id = file.id;
  const name = !isErrorFileState(file) ? file.name : undefined;
  return context.file.downloadBinary(id, name, collectionName);
};

export const renderDownloadButton = (
  file: FileState,
  context: Context,
  collectionName?: string,
) => {
  return (
    <DownloadButtonWrapper>
      <Button
        appearance="primary"
        label="Download"
        onClick={createItemDownloader(file, context, collectionName)}
      >
        Download
      </Button>
    </DownloadButtonWrapper>
  );
};
