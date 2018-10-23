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
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next-types';
import { MediaViewerError } from '../error';

const downloadIcon = <DownloadIcon label="Download" />;

const DownloadButton = withAnalyticsEvents({
  onClick: (createEvent: CreateUIAnalyticsEventSignature) => {
    const ev = createEvent({});
    const payload = ev.context[0].downloadEvent;
    ev.update(payload);
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
      <AnalyticsContext data={{ downloadEvent }}>
        <DownloadButton
          appearance="primary"
          label="Download"
          onClick={createItemDownloader(state, context, collectionName)}
        >
          Download
        </DownloadButton>
      </AnalyticsContext>
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
    <AnalyticsContext data={{ downloadEvent }}>
      <DownloadButton
        label="Download"
        appearance="toolbar"
        onClick={createItemDownloader(
          state,
          context,
          identifier.collectionName,
        )}
        iconBefore={downloadIcon}
      />
    </AnalyticsContext>
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
