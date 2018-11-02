import * as React from 'react';
import { Card } from '../src';
import {
  createStorybookContext,
  videoFileId,
  imageFileId,
  videoLargeFileId,
  videoHorizontalFileId,
} from '@atlaskit/media-test-helpers';
import {
  InlineCardVideoWrapper,
  InlineCardVideoWrapperItem,
} from '../example-helpers/styled';

const context = createStorybookContext();
const onClick = () => console.log('onClick');

export default () => (
  <InlineCardVideoWrapper>
    <InlineCardVideoWrapperItem>
      <Card
        context={context}
        identifier={imageFileId}
        disableOverlay={true}
        onClick={onClick}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <Card
        context={context}
        identifier={videoFileId}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <Card
        context={context}
        identifier={videoFileId}
        dimensions={{ width: '100%', height: 300 }}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <Card
        context={context}
        identifier={videoLargeFileId}
        dimensions={{ width: 500, height: 300 }}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <Card
        context={context}
        identifier={videoHorizontalFileId}
        dimensions={{ width: 500, height: 300 }}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <Card
        context={context}
        identifier={videoHorizontalFileId}
        dimensions={{ width: 500, height: 300 }}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
    <InlineCardVideoWrapperItem>
      <Card
        context={context}
        identifier={videoHorizontalFileId}
        onClick={onClick}
        useInlinePlayer={true}
      />
    </InlineCardVideoWrapperItem>
  </InlineCardVideoWrapper>
);
