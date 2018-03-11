import * as React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  \`\`\`NotificationIndicator\`\`\` is a React component that wraps an existing @atlaskit/badge component with
  additional functionalities:
  
  * Populate its own state by fetching data through the provided notification-log-client.
  * Sets up automatic refresh when \`\`\`refreshRate\`\`\` is specified.
  * Disables automatic refresh when tab is inactive, unless forced.

  ${(
    <Example
      Component={require('../examples/00-basic-example').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}
`;
