import * as React from 'react';
import { constructAuthTokenUrl } from '../utils';
import { Context, FileItem } from '@atlaskit/media-core';
import { DownloadButtonWrapper } from '../styled';
import Button from '@atlaskit/button';

export const downloadItem = (
  item: FileItem,
  context: Context,
  collectionName?: string,
) => async () => {
  const link = document.createElement('a');
  const name = item.details.name || 'download';
  const href = await createDownloadUrl(item, context, collectionName);

  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createDownloadUrl = async (
  item: FileItem,
  context: Context,
  collectionName?: string,
): Promise<string> => {
  const url = `/file/${item.details.id}/binary`;
  const tokenizedUrl = await constructAuthTokenUrl(
    url,
    context,
    collectionName,
  );

  return `${tokenizedUrl}&dl=true`;
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
