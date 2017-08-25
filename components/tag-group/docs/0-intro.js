// @flow
import * as React from 'react';
import path from 'path';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  A container around a [Tag](/components/tag) component that
  applies consistent styling to the collection of ties.

  ${<Example src={path.join(__dirname, '../examples/0-basic.js')}/>}
  ${<Props src={path.join(__dirname, '../src/components/TagGroup.js')}/>}
`;
