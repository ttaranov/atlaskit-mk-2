import * as React from 'react';
import { PreviewImageWrapper } from './styled';
import { PreviewData } from './types';
import { Card, FileIdentifier } from '@atlaskit/media-card';
import { createUploadContext } from '@atlaskit/media-test-helpers';

const context = createUploadContext();

export class UploadPreview extends React.Component<PreviewData> {
  render() {
    const { upfrontId } = this.props;

    if (!upfrontId) {
      return <div />;
    }

    const identifier: FileIdentifier = {
      id: upfrontId,
      mediaItemType: 'file',
    };

    upfrontId.then(id => {
      console.log('render <Card />:', id);
    });

    return (
      <PreviewImageWrapper>
        <Card identifier={identifier} context={context} />
      </PreviewImageWrapper>
    );
  }
}
