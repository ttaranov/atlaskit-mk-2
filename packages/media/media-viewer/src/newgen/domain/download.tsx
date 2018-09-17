import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { DownloadButtonWrapper } from '../styled';
import Button from '@atlaskit/button';

export const downloadItem = (
  item: FileItem,
  context: Context,
  collectionName?: string,
) => () => {
  const id = item.details.id;
  const name = item.details.name;
  return context.file.downloadBinary(id, name, collectionName);
};

export const renderDownloadButton = (
  fileItem: FileItem,
  context: Context,
  collectionName?: string,
) => {
  return (
    <DownloadButtonWrapper>
      <Button
        appearance="primary"
        label="Download"
        onClick={downloadItem(fileItem, context, collectionName)}
      >
        Download
      </Button>
    </DownloadButtonWrapper>
  );
};
