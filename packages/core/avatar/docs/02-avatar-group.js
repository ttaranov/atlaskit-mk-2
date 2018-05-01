// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
${(
  <Example
    Component={require('../examples/02-basicAvatarGroup').default}
    title="AvatarGroup"
    source={require('!!raw-loader!../examples/02-basicAvatarGroup')}
  />
)}

${(
  <Example
    Component={require('../examples/16-avatar-group-with-status').default}
    title="AvatarGroup with status"
    source={require('!!raw-loader!../examples/16-avatar-group-with-status')}
  />
)}

${(
  <Props
    heading="Avatar Group Props"
    props={require('!!extract-react-types-loader!../src/components/AvatarGroup')}
  />
)}
`;
