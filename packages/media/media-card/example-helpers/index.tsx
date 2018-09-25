/* tslint:disable:no-console */

import * as React from 'react';
import {
  MediaCollectionItem,
  MediaCollection,
  Context,
} from '@atlaskit/media-core';
import { createStorybookContext } from '@atlaskit/media-test-helpers';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import { SelectableCard } from './selectableCard';
import {
  Card,
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
  handler: () => {
    console.log('open');
  },
};
export const closeAction = {
  label: 'Close',
  handler: () => {
    console.log('close');
  },
};
export const deleteAction = {
  label: 'Delete',
  handler: () => {
    console.log('delete');
  },
  icon: <CrossIcon size="small" label="delete" />,
};

export const annotateCardAction = {
  label: 'Annotate',
  handler: () => {
    console.log('annotate');
  },
  icon: <AnnotateIcon size="small" label="annotate" />,
};

export const actions = [
  openAction,
  closeAction,
  annotateCardAction,
  deleteAction,
];

export const anotherAction = {
  label: 'Some other action',
  handler: (item: MediaCollectionItem, collection: MediaCollection) => {
    console.log('Some other action', item, collection);
  },
};

export const annotateAction = {
  label: 'Annotate',
  handler: (item: MediaCollectionItem, collection: MediaCollection) => {
    console.log('annotate', item, collection);
  },
};

// TODO: Add deleteAction back to story. see: https://jira.atlassian.com/browse/FIL-4004
export const cardsActions = [/*deleteAction, */ anotherAction, annotateAction];
export const wrongContext: Context = createStorybookContext({
  authType: 'client',
});
export const wrongCollection = 'adfasdf';
