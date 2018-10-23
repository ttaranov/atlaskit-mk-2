import * as React from 'react';
import { Context, FileState, isErrorFileState } from '@atlaskit/media-core';
import { DownloadButtonWrapper } from './styled';
import Button from '@atlaskit/button';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  downloadButtonEvent,
  downloadErrorButtonEvent,
} from './analytics/download';
import { channel } from './analytics';
import { Identifier } from './domain';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next-types';
import { MediaViewerError } from './error';

const downloadIcon = <DownloadIcon label="Download" />;

export const DownloadButton = withAnalyticsEvents({
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

export type ErrorViewDownloadButtonProps = {
  state: FileState;
  context: Context;
  err: MediaViewerError;
  collectionName?: string;
};

export const ErrorViewDownloadButton = (
  props: ErrorViewDownloadButtonProps,
) => {
  const downloadEvent = downloadErrorButtonEvent(props.state, props.err);
  return (
    <DownloadButtonWrapper>
      <DownloadButton
        analyticsPayload={downloadEvent}
        appearance="primary"
        label="Download"
        onClick={createItemDownloader(
          props.state,
          props.context,
          props.collectionName,
        )}
      >
        Download
      </DownloadButton>
    </DownloadButtonWrapper>
  );
};

export type ToolbarDownloadButtonProps = {
  state: FileState;
  identifier: Identifier;
  context: Context;
};

export const ToolbarDownloadButton = (props: ToolbarDownloadButtonProps) => {
  const downloadEvent = downloadButtonEvent(props.state);
  return (
    <DownloadButton
      analyticsPayload={downloadEvent}
      label="Download"
      appearance="toolbar"
      onClick={createItemDownloader(
        props.state,
        props.context,
        props.identifier.collectionName,
      )}
      iconBefore={downloadIcon}
    />
  );
};

export const DisabledToolbarDownloadButton = (
  <Button
    label="Download"
    appearance="toolbar"
    isDisabled={true}
    iconBefore={downloadIcon}
  />
);
