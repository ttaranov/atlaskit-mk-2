// @flow

import React from 'react';
import InlineMessage from '../src';

const MessageContent = (
  <div>
    <span>Authenticate heading</span>
    <span>
      Authenticate <a href="https://atlaskit.atlassian.com/">here</a> to see
      more information
    </span>
  </div>
);

export default () => (
  <InlineMessage
    type="connectivity"
    title="JIRA Service Desk"
    secondaryText="Carrot cake chocolate bar caramels."
    position="right middle"
  >
    {MessageContent}
  </InlineMessage>
);
