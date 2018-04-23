// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`

${(
  <Example
    Component={require('../examples/15-skeleton').default}
    title="AvatarGroup"
    source={require('!!raw-loader!../examples/15-skeleton')}
  />
)}

${(
  <Props
    heading="Skeleton Props"
    props={require('!!extract-react-types-loader!../src/components/Skeleton')}
  />
)}
`;
