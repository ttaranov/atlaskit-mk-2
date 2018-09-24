import * as React from 'react';
import { constructAuthTokenUrl } from '../utils';
import { Context, FileState } from '@atlaskit/media-core';
import { DownloadButtonWrapper } from '../styled';
import Button from '@atlaskit/button';

export const downloadItem = (
  file: FileState,
  context: Context,
  collectionName?: string,
) => async () => {
  const link = document.createElement('a');
  const name =
    file.status === 'processed' && file.name ? file.name : 'download';
  const href = await createDownloadUrl(file, context, collectionName);

  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createDownloadUrl = async (
  file: FileState,
  context: Context,
  collectionName?: string,
): Promise<string> => {
  const url = `/file/${file.id}/binary`;
  const tokenizedUrl = await constructAuthTokenUrl(
    url,
    context,
    collectionName,
  );

  return `${tokenizedUrl}&dl=true`;
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
        onClick={downloadItem(file, context, collectionName)}
      >
        Download
      </Button>
    </DownloadButtonWrapper>
  );
};
