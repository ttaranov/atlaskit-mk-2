import * as React from 'react';
import { Context, FileState, isErrorFileState } from '@atlaskit/media-core';
import { DownloadButtonWrapper } from '../styled';
import Button from '@atlaskit/button';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  downloadButtonEvent,
  downloadErrorButtonEvent,
} from '../analytics/download';
import { channel } from '../analytics';
import { Identifier } from '../domain';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next-types';
import { MediaViewerError } from '../error';

const downloadIcon = <DownloadIcon label="Download" />;

const DownloadButton = withAnalyticsEvents({
  onClick: (createEvent: CreateUIAnalyticsEventSignature, props: any) => {
    const ev = createEvent(props.analyticsPayload);
    ev.fire(channel);
  },
})(Button);

export const createItemDownloader = (
  file: FileState,
  context: Context,
  collectionName?: string,
) => () => {
  const id = file.id;
  const name = !isErrorFileState(file) ? file.name : undefined;
  return context.file.downloadBinary(id, name, collectionName);
};

export const renderErrorViewDownloadButton = (
  state: FileState,
  context: Context,
  err: MediaViewerError,
  collectionName?: string,
) => {
  const downloadEvent = downloadErrorButtonEvent(state, err);
  return (
    <DownloadButtonWrapper>
      <DownloadButton
        analyticsPayload={downloadEvent}
        appearance="primary"
        label="Download"
        onClick={createItemDownloader(state, context, collectionName)}
      >
        Download
      </DownloadButton>
    </DownloadButtonWrapper>
  );
};

export const renderToolbarDownloadButton = (
  state: FileState,
  identifier: Identifier,
  context: Context,
) => {
  const downloadEvent = downloadButtonEvent(state);
  return (
    <DownloadButton
      analyticsPayload={downloadEvent}
      label="Download"
      appearance="toolbar"
      onClick={createItemDownloader(state, context, identifier.collectionName)}
      iconBefore={downloadIcon}
    />
  );
};

export const disabledDownloadButton = (
  <Button
    label="Download"
    appearance="toolbar"
    isDisabled={true}
    iconBefore={downloadIcon}
  />
);
