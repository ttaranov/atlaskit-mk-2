import * as React from 'react';
import { PreviewImageWrapper, InfoWrapper } from './styled';
import { PreviewData } from './types';
import { Card, FileIdentifier } from '@atlaskit/media-card';
import { createUploadContext } from '@atlaskit/media-test-helpers';
import { Preview, ImagePreview } from '../src/domain/preview';

const context = createUploadContext();

export class UploadPreview extends React.Component<PreviewData> {
  getPreviewInfo(preview: Preview): string | null {
    if ('scaleFactor' in preview) {
      const imgPreview = preview as ImagePreview;
      return `${imgPreview.dimensions.width} x ${
        imgPreview.dimensions.height
      } @${imgPreview.scaleFactor}x`;
    } else {
      return null;
    }
  }

  render() {
    const { upfrontId, preview } = this.props;

    if (!upfrontId) {
      return <div />;
    }

    const identifier: FileIdentifier = {
      id: upfrontId,
      mediaItemType: 'file',
    };

    return (
      <PreviewImageWrapper>
        <Card identifier={identifier} context={context} />
        {preview ? (
          <InfoWrapper>{this.getPreviewInfo(preview)}</InfoWrapper>
        ) : null}
      </PreviewImageWrapper>
    );
  }
}
