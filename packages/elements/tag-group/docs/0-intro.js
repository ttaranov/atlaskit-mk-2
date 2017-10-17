// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  A container around a [Tag](/components/tag) component that applies consistent
  styling to the collection of ties.

  ${<Example
    Component={require('../examples/0-basic').default}
    source={require('!!raw-loader!../examples/0-basic')}
  />}

  ${<Props props={require('!!extract-react-types-loader!../src/components/TagGroup')} />}
`;
