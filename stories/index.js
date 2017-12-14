// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import fetchMock from 'fetch-mock';
import '@atlaskit/css-reset';
import ConfluencePageTree from '../packages/fabric/confluence-page-tree';
import pageDetailsMockData from './page-details.json';
import pageListMockData from './page-list.json';

let currentStory;
const CONFLUENCE_PUBLIC_API = /wiki\/rest\/api\/content\/*/;
const emptyResponse = {
  results: [],
  start: 0,
  limit: 200,
  size: 0,
};

fetchMock.get(CONFLUENCE_PUBLIC_API, url => {
  let response;
  if (currentStory === 'error') {
    response = {
      status: 404,
    };
  } else if (currentStory === 'empty') {
    response = emptyResponse;
  } else if (currentStory === 'list') {
    response = url.includes('/search') ? pageDetailsMockData : pageListMockData;
  }
  return response;
});

storiesOf('ConfluencePageTree', module)
  .add('List', () => {
    currentStory = 'list';
    return (
      <ConfluencePageTree
        contentId={'65538'}
        cloudId={'56765c63-6627-4235-9328-e3a28ef97069'}
      />
    );
  })
  .add('Error state', () => {
    currentStory = 'error';
    return <ConfluencePageTree contentId={'111'} cloudId={'222'} />;
  })
  .add('Empty state', () => {
    currentStory = 'empty';
    return <ConfluencePageTree contentId={'111'} cloudId={'222'} />;
  });
