import * as React from 'react';
import { PureComponent } from 'react';
import { MediaType, MediaItemType } from '@atlaskit/media-core';
import { MediaImage } from '../../mediaImage';
import { CardLoading } from '../../cardLoading';
import { shouldDisplayImageThumbnail } from '../../shouldDisplayImageThumbnail';

export interface CardContentProps {
  mediaItemType?: MediaItemType;
  mediaType?: MediaType;
  dataURI?: string;
  loading?: boolean;
  crop?: boolean;
}

export class CardContent extends PureComponent<CardContentProps, {}> {
  render() {
    const { loading, mediaType, mediaItemType, dataURI, crop } = this.props;

    if (loading) {
      return <CardLoading mediaItemType={mediaItemType} />;
    }

    if (shouldDisplayImageThumbnail(dataURI, mediaType)) {
      return <MediaImage dataURI={dataURI} fadeIn={loading} crop={crop} />;
    } else {
      return null;
    }
  }
}
