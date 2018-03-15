import * as React from 'react';
import { Component } from 'react';
import { MediaType, ImageResizeMode } from '@atlaskit/media-core';

import { CardDimensions, CardStatus } from '../../index';
import { CardImageView } from '../../utils/cardImageView';
import { toHumanReadableMediaSize } from '../../utils';
import { CardAction } from '../../actions';

export interface FileCardImageViewProps {
  mediaName?: string;
  mediaType?: MediaType;
  mediaSize?: number;

  dataURI?: string;
  progress?: number;
  status: CardStatus;

  dimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;

  selectable?: boolean;
  selected?: boolean;

  error?: string;

  actions?: Array<CardAction>;
  onRetry?: () => void;
}

export class FileCardImageView extends Component<FileCardImageViewProps, {}> {
  render() {
    const {
      error,
      mediaSize,
      mediaType,
      mediaName,
      dataURI,
      progress,
      status,
      dimensions,
      selectable,
      selected,
      actions,
      onRetry,
      resizeMode,
    } = this.props;
    const fileSize = toHumanReadableMediaSize(mediaSize || 0);

    return (
      <CardImageView
        error={error}
        mediaType={mediaType}
        mediaName={mediaName}
        subtitle={fileSize}
        dataURI={dataURI}
        progress={progress}
        status={status}
        dimensions={dimensions}
        selectable={selectable}
        selected={selected}
        actions={actions}
        resizeMode={resizeMode}
        onRetry={onRetry}
      />
    );
  }
}

export default FileCardImageView;
