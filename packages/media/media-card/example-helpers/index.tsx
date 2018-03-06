/* tslint:disable:no-console */

import * as React from 'react';
import {
  CardActionType,
  MediaCollectionItem,
  MediaCollection,
  Context,
} from '@atlaskit/media-core';
import { createStorybookContext } from '@atlaskit/media-test-helpers';
import { SelectableCard } from './selectableCard';
import {
  Card,
  CardActionType,
  Identifier,
  CardAppearance,
  CardEvent,
  OnSelectChangeFuncResult,
} from '../src';

const context = createStorybookContext();

export const clickHandler = (result: CardEvent) => {
  result.event.preventDefault();
  console.log('click', result.mediaItemDetails);
};

export const mouseEnterHandler = (result: CardEvent) => {
  result.event.preventDefault();
  console.log('mouseEnter', result.mediaItemDetails);
};

export const onSelectChangeHandler = (result: OnSelectChangeFuncResult) => {
  console.log('selectChanged', result);
};

export const createApiCards = (
  appearance: CardAppearance,
  identifier: Identifier,
) => {
  // API methods
  const apiCards = [
    {
      title: 'not selectable',
      content: (
        <Card
          context={context}
          appearance={appearance}
          identifier={identifier}
          onClick={clickHandler}
          onMouseEnter={mouseEnterHandler}
        />
      ),
    },
  ];

  const selectableCard = {
    title: 'selectable',
    content: (
      <SelectableCard
        context={context}
        identifier={identifier}
        onSelectChange={onSelectChangeHandler}
      />
    ),
  };

  if (appearance === 'image') {
    return [...apiCards, selectableCard];
  }

  return apiCards;
};

export const openAction = {
  label: 'Open',
  type: undefined,
  handler: () => {
    console.log('open');
  },
};
export const closeAction = {
  label: 'Close',
  type: undefined,
  handler: () => {
    console.log('close');
  },
};
export const deleteAction = {
  label: 'Delete',
  type: CardActionType.delete,
  handler: () => {
    console.log('delete');
  },
};

export const actions = [openAction, closeAction, deleteAction];

export const anotherAction = {
  type: -2,
  label: 'Some other action',
  handler: (
    item: MediaCollectionItem,
    collection: MediaCollection,
    e?: Event,
  ) => {
    console.log('Some other action', item, collection);
  },
};

export const annotateAction = {
  type: -1,
  label: 'Annotate',
  handler: (
    item: MediaCollectionItem,
    collection: MediaCollection,
    e?: Event,
  ) => {
    console.log('annotate', item, collection);
  },
};

// TODO: Add deleteAction back to story. see: https://jira.atlassian.com/browse/FIL-4004
export const cardsActions = [/*deleteAction, */ anotherAction, annotateAction];
export const wrongContext: Context = createStorybookContext({
  serviceHost: 'http://example.com',
  authType: 'client',
});
export const wrongCollection = 'adfasdf';
// TODO: Add CollectionCardDelete into media-core. see: https://jira.atlassian.com/browse/FIL-4004
// const deleteAction = CollectionCardDelete((item: MediaItem, items: Array<{ id: string }>, e?: Event) => {
//   console.log('delete')(item, items);
// });

// TODO: Add deleteAction back to story. see: https://jira.atlassian.com/browse/FIL-4004
