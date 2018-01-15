import { storiesOf } from '@kadira/storybook';
import React from 'react';
import Readme from '@atlaskit/util-readme';
import droplistSource from '!raw!../src/components/Droplist';

import DropList from '../src';

/* eslint-disable import/first, import/no-duplicates */
import DroplistOverviewExample from './examples/DroplistOverview';
import DroplistOverviewExampleRaw from '!raw!./examples/DroplistOverview';
/* eslint-enable import/first, import/no-duplicates */

import DroplistFitExample from './examples/DroplistFit';
import DroplistOverflowItemsExample from './examples/DroplistOverflowItems';
import DroplistMultilineItemsExample from './examples/DroplistMultilineItems';
import BoundariesElementExample from './examples/DroplistBoundariesElement';

import ManyItemsExample from './examples/ManyItemsExample';

import { name } from '../package.json';

storiesOf(name, module)
  .add('Droplist overview', () => (
    <Readme
      name={name}
      component={DropList}
      componentSource={droplistSource}
      example={DroplistOverviewExample}
      exampleSource={DroplistOverviewExampleRaw}
      description={
        <p>This is a `base` component on which such components as @atlaskit/dropdown-menu,
@atlaskit/single-select, @atlaskit/multi-select are built. It contains only styles and
very basic logic. It does not have any keyboard interactions, selectable logic or
open/close functionality</p>
      }
    />
  ))
  .add('Droplist that fits container width', () => (
    DroplistFitExample
  ))
  .add('Droplist with long items (default behaviour)', () => (
    DroplistOverflowItemsExample
  ))
  .add('Droplist with long items with multiline option', () => (
    DroplistMultilineItemsExample
  ))
  .add('with lots of items', () => (
    <ManyItemsExample />
  ))
  .add('with lots of items in a group', () => (
    <ManyItemsExample withGroup />
  ))
  .add('with lots of items and tall appearance', () => (
    <ManyItemsExample appearance="tall" />
  ))
  .add('constrained to the scrollParent', () => (
    BoundariesElementExample
  ))
  .add('Droplist that is loading', () => (
    <DropList isLoading isOpen />
  ));
