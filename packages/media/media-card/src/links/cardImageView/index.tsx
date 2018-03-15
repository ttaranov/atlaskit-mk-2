import * as React from 'react';
import { Component } from 'react';
import { ImageResizeMode } from '@atlaskit/media-core';

import { CardDimensions, CardAppearance, CardStatus } from '../../index';
import { CardImageView } from '../../utils/cardImageView';
import { CardAction } from '../../actions';

export interface LinkCardImageViewProps {
  linkUrl: string;
  title: string;
  site?: string;
  description?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  appearance?: CardAppearance;
  dimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
  status: CardStatus;
  actions?: Array<CardAction>;
  error?: string;
}

export class LinkCardImageView extends Component<LinkCardImageViewProps, {}> {
  render() {
    const {
      title,
      site,
      thumbnailUrl,
      status,
      dimensions,
      actions,
      error,
      iconUrl,
      linkUrl,
      resizeMode,
    } = this.props;

    return (
      <CardImageView
        mediaItemType="link"
        mediaName={title}
        subtitle={site || linkUrl}
        mediaType="image"
        dataURI={thumbnailUrl}
        status={status}
        dimensions={dimensions}
        actions={actions}
        error={error}
        icon={iconUrl}
        resizeMode={resizeMode}
      />
    );
  }
}
