import * as React from 'react';
import { PureComponent } from 'react';
import { MediaType, MediaItemType } from '@atlaskit/media-core';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import { MediaImage } from '../../../utils/mediaImage';
import { CardLoading } from '../../../utils/cardLoading';
import { shouldDisplayImageThumbnail } from '../../../utils/shouldDisplayImageThumbnail';
import { PlayIconWrapper } from '../styled';

export interface CardContentProps {
  mediaItemType?: MediaItemType;
  mediaType?: MediaType;
  dataURI?: string;
  loading?: boolean;
  crop?: boolean;
  readonly previewOrientation?: number;
}

export class CardContent extends PureComponent<CardContentProps, {}> {
  renderPlayButton = () => {
    const { mediaType } = this.props;
    if (mediaType !== 'video') {
      return null;
    }

    return (
      <PlayIconWrapper key="play-icon">
        <VidPlayIcon label="play" size="large" />
      </PlayIconWrapper>
    );
  };

  render() {
    const {
      loading,
      mediaType,
      mediaItemType,
      dataURI,
      crop,
      previewOrientation,
    } = this.props;

    if (loading) {
      return <CardLoading mediaItemType={mediaItemType} />;
    }

    if (shouldDisplayImageThumbnail(dataURI, mediaType)) {
      return [
        <MediaImage
          key="media-image"
          dataURI={dataURI}
          crop={crop}
          previewOrientation={previewOrientation}
        />,
        this.renderPlayButton(),
      ];
    } else {
      return null;
    }
  }
}
