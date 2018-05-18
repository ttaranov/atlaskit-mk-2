import * as React from 'react';

import {
  createStorybookContext,
  defaultCollectionName,
  fileCollectionName,
  emptyCollectionName,
} from '@atlaskit/media-test-helpers';

import { renderVariousWidths } from '../example-helpers/card-list/various-widths';
import { renderEmptyStates } from '../example-helpers/card-list/empty-states';
import { renderErrorStates } from '../example-helpers/card-list/error-states';
import { renderInfiniteScroll } from '../example-helpers/card-list/infinite-scroll';
import { renderActionableLists } from '../example-helpers/card-list/actionable';

const context = createStorybookContext();

export default () => (
  <div>
    <h2>Custom widths</h2>
    {renderVariousWidths(context, fileCollectionName)}
    <h2>Empty state</h2>
    {renderEmptyStates(context, emptyCollectionName)}
    <h2>Error state</h2>
    {renderErrorStates()}
    <h2>Lazy Loading</h2>
    TBC
    <h2>Actions</h2>
    {renderActionableLists(context, fileCollectionName)}
    <h2>Infinite Scroll</h2>
    {renderInfiniteScroll(context, defaultCollectionName)}
  </div>
);
