// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
${(
  <Example
    Component={require('../examples/03-basicAvatarItem').default}
    title="Avatar Item"
    source={require('!!raw-loader!../examples/03-basicAvatarItem')}
  />
)}

${(
  <Props
    heading="Avatar Item Props"
    props={require('!!extract-react-types-loader!../src/components/AvatarItem')}
  />
)}
`;
