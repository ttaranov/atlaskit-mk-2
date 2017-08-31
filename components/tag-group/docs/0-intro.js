// @flow
import * as React from 'react';
import path from 'path';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  A container around a [Tag](/components/tag) component that
  applies consistent styling to the collection of ties.

  ${<Example source={require('!!raw-loader!../examples/0-basic')} />}

  ${<Props source={require('!!raw-loader!../src/components/TagGroup')} />}
`;
