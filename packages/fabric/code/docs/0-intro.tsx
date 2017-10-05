import * as React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  Renders inline code snippets and code blocks.

  ## Inline Code

  ${<Example
    Component={require('../examples/00-inline-code-basic').default}
    source={require('!!raw-loader!../examples/00-inline-code-basic')}
  />}
`;
