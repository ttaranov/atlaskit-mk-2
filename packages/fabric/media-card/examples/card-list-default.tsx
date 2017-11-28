import * as React from 'react';
import { Component } from 'react';
import { MediaCollection, MediaCollectionItem } from '@atlaskit/media-core';
import {
  StoryList,
  createStorybookContext,
  collectionNames,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList, CardListEvent } from '../src';

const context = createStorybookContext();

export default () => (
  <CardList context={context} collectionName={defaultCollectionName} />
);
