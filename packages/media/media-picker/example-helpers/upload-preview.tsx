import * as React from 'react';
import { PreviewImageWrapper, InfoWrapper } from './styled';
import { PreviewData } from './types';
import { Card, FileIdentifier } from '@atlaskit/media-card';
import { createUploadContext } from '@atlaskit/media-test-helpers';
import { ImageMetaData } from '@atlaskit/media-ui';

const context = createUploadContext();

export class UploadPreview extends React.Component<PreviewData> {
  getInfoSummary(info?: ImageMetaData): string {
    if (info) {
      let tags = 'none';
      if (info.tags) {
        const metaTags = info.tags;
        tags = Object.keys(info.tags)
          .map(key => `${key}: ${JSON.stringify(metaTags[key])}`)
          .join('\n');
      }
      return `[ general ]\ntype: ${info.type}\nwidth: ${info.width}\nheight: ${
        info.height
      }\n\n[ metatags ]\n${tags}`;
    }
    return 'no info available.';
  }

  render() {
    const { upfrontId, info } = this.props;

    if (!upfrontId) {
      return <div />;
    }

    const identifier: FileIdentifier = {
      id: upfrontId,
      mediaItemType: 'file',
    };

    const infoSummary = this.getInfoSummary(info);

    return (
      <PreviewImageWrapper>
        <Card identifier={identifier} context={context} />
        {info ? <InfoWrapper>{infoSummary}</InfoWrapper> : null}
      </PreviewImageWrapper>
    );
  }
}
