import * as React from 'react';
import { MediaItemType } from '@atlaskit/media-core';
import FileIcon from '@atlaskit/icon/glyph/file';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { MediaImage } from '../../../utils/mediaImage';
import {
  RoundedBackground,
  LoadingPlaceholder,
  EmptyPlaceholder,
} from './styled';

export interface ThumbnailViewProps {
  type: MediaItemType;
  url?: string;
  isLoading?: boolean;
}

export class ThumbnailView extends React.Component<ThumbnailViewProps, {}> {
  render() {
    const { type, url, isLoading } = this.props;
    if (isLoading) {
      return (
        <RoundedBackground>
          <LoadingPlaceholder />
        </RoundedBackground>
      );
    } else if (url) {
      return (
        <RoundedBackground>
          <MediaImage dataURI={url} />
        </RoundedBackground>
      );
    } else {
      return (
        <RoundedBackground>
          <EmptyPlaceholder>
            {type === 'link' ? (
              <LinkIcon label="link" size="medium" />
            ) : (
              <FileIcon label="file" size="medium" />
            )}
          </EmptyPlaceholder>
        </RoundedBackground>
      );
    }
  }
}
