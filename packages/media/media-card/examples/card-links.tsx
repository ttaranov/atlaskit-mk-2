/* tslint:disable:no-console */
import * as React from 'react';
import {
  StoryList,
  createStorybookContext,
  genericUrlPreviewId,
  youTubeUrlPreviewId,
  spotifyUrlPreviewId,
  soundcloudUrlPreviewId,
  publicTrelloBoardUrlPreviewId,
  privateTrelloBoardUrlPreviewId,
  errorLinkId,
} from '@atlaskit/media-test-helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';

import { Card } from '../src';
import { createApiCards } from '../example-helpers';

const context = createStorybookContext();
const onClick = (_: any, analyticsEvent: any) => {
  console.log('public analytics onClick event', analyticsEvent);
};

// standard
const standardCards = [
  {
    title: 'Auto',
    content: (
      <Card
        identifier={genericUrlPreviewId}
        context={context}
        appearance="auto"
        onClick={onClick}
      />
    ),
  },
  {
    title: 'Small',
    content: (
      <Card
        identifier={genericUrlPreviewId}
        context={context}
        appearance="small"
      />
    ),
  },
  {
    title: 'Image',
    content: (
      <Card
        identifier={genericUrlPreviewId}
        context={context}
        appearance="image"
      />
    ),
  },
  {
    title: 'Horizontal',
    content: (
      <Card
        identifier={genericUrlPreviewId}
        context={context}
        appearance="horizontal"
      />
    ),
  },
  {
    title: 'Square',
    content: (
      <Card
        identifier={genericUrlPreviewId}
        context={context}
        appearance="square"
      />
    ),
  },
];

// api cards
const apiCards = createApiCards('horizontal', genericUrlPreviewId);

// errors
const errorCards = [
  {
    title: 'Small',
    content: (
      <Card identifier={errorLinkId} context={context} appearance="small" />
    ),
  },
  {
    title: 'Image',
    content: (
      <Card identifier={errorLinkId} context={context} appearance="image" />
    ),
  },
  {
    title: 'Horizontal',
    content: (
      <Card
        identifier={errorLinkId}
        context={context}
        appearance="horizontal"
      />
    ),
  },
  {
    title: 'Square',
    content: (
      <Card identifier={errorLinkId} context={context} appearance="square" />
    ),
  },
];

const smartCards = [
  {
    title: 'Public board',
    content: (
      <Card identifier={publicTrelloBoardUrlPreviewId} context={context} />
    ),
  },
  {
    title: 'Private board',
    content: (
      <Card identifier={privateTrelloBoardUrlPreviewId} context={context} />
    ),
  },
];

const smartCardsAppearances = [
  {
    title: 'Small',
    content: (
      <Card
        identifier={publicTrelloBoardUrlPreviewId}
        context={context}
        appearance="small"
      />
    ),
  },
  {
    title: 'Image',
    content: (
      <Card
        identifier={publicTrelloBoardUrlPreviewId}
        context={context}
        appearance="image"
      />
    ),
  },
  {
    title: 'Horizontal',
    content: (
      <Card
        identifier={publicTrelloBoardUrlPreviewId}
        context={context}
        appearance="horizontal"
      />
    ),
  },
  {
    title: 'Square',
    content: (
      <Card
        identifier={publicTrelloBoardUrlPreviewId}
        context={context}
        appearance="square"
      />
    ),
  },
];

const embedCards = [
  {
    title: 'YouTube',
    content: <Card identifier={youTubeUrlPreviewId} context={context} />,
  },
  {
    title: 'Spotify',
    content: <Card identifier={spotifyUrlPreviewId} context={context} />,
  },
  {
    title: 'Sound Cloud',
    content: <Card identifier={soundcloudUrlPreviewId} context={context} />,
  },
  {
    title: 'Twitter',
    content: (
      <Card
        context={context}
        identifier={{
          mediaItemType: 'link',
          url: 'https://twitter.com/horse_js/status/859988831780708352',
        }}
      />
    ),
  },
  {
    title: 'Trello',
    content: (
      <Card
        context={context}
        identifier={{
          mediaItemType: 'link',
          url: 'https://trello.com/c/ksPxRsbf/1-test',
        }}
      />
    ),
  },
];

const handleEvent = (analyticsEvent: UIAnalyticsEventInterface) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

export default () => (
  <AnalyticsListener channel="media" onEvent={handleEvent}>
    <div>
      <h1 style={{ margin: '10px 20px' }}>Link cards</h1>
      <div style={{ margin: '20px 40px' }}>
        <h3>Standard</h3>
        <StoryList>{standardCards}</StoryList>

        <h3>API Cards</h3>
        <StoryList>{apiCards}</StoryList>

        <h3>Error</h3>
        <StoryList>{errorCards}</StoryList>

        <h3>Smart cards</h3>
        <StoryList>{smartCards}</StoryList>
        <StoryList>{smartCardsAppearances}</StoryList>

        <h3>Embed cards</h3>
        <StoryList>{embedCards}</StoryList>
      </div>
    </div>
  </AnalyticsListener>
);
