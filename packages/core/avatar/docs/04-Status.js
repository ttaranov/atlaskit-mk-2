// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
${(
  <Example
    Component={require('../examples/05-basicStatus').default}
    title="Status"
    source={require('!!raw-loader!../examples/05-basicStatus')}
  />
)}

${(
  <Props
    heading="Status Props"
    props={require('!!extract-react-types-loader!../src/components/Status')}
  />
)}
`;
