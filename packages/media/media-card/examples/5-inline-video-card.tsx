import * as React from 'react';
import { Card } from '../src';
import {
  createStorybookContext,
  videoFileId,
  videoLargeFileId,
  videoHorizontalFileId,
} from '@atlaskit/media-test-helpers';
import { InlineCardVideoWrapper } from '../example-helpers/styled';

const context = createStorybookContext();
const onClick = () => console.log('onClick');

export default () => (
  <InlineCardVideoWrapper>
    <Card
      context={context}
      identifier={videoFileId}
      disableOverlay={true}
      onClick={onClick}
    />
    <Card
      context={context}
      identifier={videoFileId}
      dimensions={{ width: 500, height: 300 }}
      disableOverlay={true}
      onClick={onClick}
    />
    <Card
      context={context}
      identifier={videoLargeFileId}
      dimensions={{ width: 500, height: 300 }}
      disableOverlay={true}
      onClick={onClick}
    />
    <Card
      context={context}
      identifier={videoHorizontalFileId}
      dimensions={{ width: 500, height: 300 }}
      disableOverlay={true}
      onClick={onClick}
    />
    <Card
      context={context}
      identifier={videoHorizontalFileId}
      dimensions={{ width: 500, height: 300 }}
      onClick={onClick}
    />
    <Card
      context={context}
      identifier={videoHorizontalFileId}
      onClick={onClick}
    />
  </InlineCardVideoWrapper>
);
