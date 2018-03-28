import * as React from 'react';
import { PureComponent } from 'react';
import { MediaType, MediaItemType } from '@atlaskit/media-core';
import { MediaImage } from '../../mediaImage';
import { CardLoading } from '../../cardLoading';
import { shouldDisplayImageThumbnail } from '../../shouldDisplayImageThumbnail';
import { CardDimensions } from '../../../index';

export interface CardContentProps {
  dimensions?: CardDimensions;
  mediaItemType?: MediaItemType;
  mediaType?: MediaType;
  dataURI?: string;
  loading?: boolean;
  crop?: boolean;
}

export class CardContent extends PureComponent<CardContentProps, {}> {
  render() {
    const {
      loading,
      mediaType,
      mediaItemType,
      dataURI,
      crop,
      dimensions,
    } = this.props;

    if (loading) {
      return <CardLoading mediaItemType={mediaItemType} />;
    }

    if (shouldDisplayImageThumbnail(dataURI, mediaType)) {
      return (
        <MediaImage
          dataURI={dataURI}
          fadeIn={loading}
          crop={crop}
          dimensions={dimensions}
        />
      );
    } else {
      return null;
    }
  }
}
