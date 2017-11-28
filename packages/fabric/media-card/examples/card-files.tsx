import * as React from 'react';
import {
  StoryList,
  Matrix,
  createStorybookContext,
  defaultCollectionName as collectionName,
  videoUrlPreviewId,
  audioUrlPreviewId,
  imageUrlPreviewId,
  docUrlPreviewId,
  unknownUrlPreviewId,
  genericUrlPreviewId,
  youTubeUrlPreviewId,
  spotifyUrlPreviewId,
  soundcloudUrlPreviewId,
  publicTrelloBoardUrlPreviewId,
  privateTrelloBoardUrlPreviewId,
  errorLinkId,
  videoFileId,
  audioFileId,
  imageFileId,
  docFileId,
  unknownFileId,
  smallImageFileId,
  wideImageFileId,
  largeImageFileId,
  errorFileId,
} from '@atlaskit/media-test-helpers';

import {
  Card,
  UrlPreviewIdentifier,
  FileIdentifier,
  Identifier,
  CardAppearance,
  CardEvent,
  OnSelectChangeFuncResult,
} from '../src';
import { createApiCards } from '../example-helpers';

const menuActions = [
  {
    label: 'Open',
    handler: () => {
      action('open')();
    },
  },
  {
    label: 'Close',
    handler: () => {
      action('close')();
    },
  },
];

const context = createStorybookContext();
// standard
const successIdentifier: FileIdentifier = imageFileId;
const standardCards = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={successIdentifier}
        context={context}
        appearance="small"
      />
    ),
  },
  {
    title: 'Image',
    content: (
      <Card
        identifier={successIdentifier}
        context={context}
        appearance="image"
      />
    ),
  },
];

// errors
const errorCards = [
  {
    title: 'Small',
    content: (
      <Card identifier={errorFileId} context={context} appearance="small" />
    ),
  },
  {
    title: 'Image',
    content: (
      <Card identifier={errorFileId} context={context} appearance="image" />
    ),
  },
];

const menuCards = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={successIdentifier}
        context={context}
        appearance="small"
        actions={menuActions}
      />
    ),
  },
  {
    title: 'Image',
    content: (
      <Card
        identifier={successIdentifier}
        context={context}
        appearance="image"
        actions={menuActions}
      />
    ),
  },
];

// api cards
const apiCards = createApiCards('image', successIdentifier);

// no thumbnail
const noThumbnailCards = [
  {
    title: 'Small',
    content: (
      <Card identifier={unknownFileId} context={context} appearance="small" />
    ),
  },
  {
    title: 'Image',
    content: (
      <Card identifier={unknownFileId} context={context} appearance="image" />
    ),
  },
];

// lazy load
const lazyLoadCards = [
  {
    title: 'Lazy',
    content: (
      <Card
        isLazy={true}
        identifier={successIdentifier}
        context={context}
        appearance="image"
      />
    ),
  },
  {
    title: 'No lazy',
    content: (
      <Card
        isLazy={false}
        identifier={successIdentifier}
        context={context}
        appearance="image"
      />
    ),
  },
];

// collection and no collection configuration of files
const fileWithNoCollection: FileIdentifier = {
  mediaItemType: 'file',
  id: 'e84c54a4-38b2-463f-ae27-5ba043c3e4c2',
};

const collectionConfigCards = [
  {
    title: 'Standalone file (NO collection)',
    content: <Card identifier={fileWithNoCollection} context={context} />,
  },
  {
    title: 'File within collection',
    content: <Card identifier={successIdentifier} context={context} />,
  },
];
export default () => (
  <div>
    <h1 style={{ margin: '10px 20px' }}>File cards</h1>
    <div style={{ margin: '20px 40px' }}>
      <h3>Standard</h3>
      <StoryList>{standardCards}</StoryList>

      <h3>Error</h3>
      <StoryList>{errorCards}</StoryList>

      <h3>Menu</h3>
      <StoryList>{menuCards}</StoryList>

      <h3>API Cards</h3>
      <StoryList>{apiCards}</StoryList>

      <h3>Thumbnail not available</h3>
      <StoryList>{noThumbnailCards}</StoryList>

      <h3>Lazy load</h3>
      <StoryList>{lazyLoadCards}</StoryList>

      <h3>Collection configurations</h3>
      <StoryList>{collectionConfigCards}</StoryList>
    </div>
  </div>
);
