// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`

${(
  <Example
    Component={require('../examples/04-basicPresence').default}
    title="Presence"
    source={require('!!raw-loader!../examples/04-basicPresence')}
  />
)}

${(
  <Props
    heading="Presence Props"
    props={require('!!extract-react-types-loader!../src/components/Presence')}
  />
)}
`;
