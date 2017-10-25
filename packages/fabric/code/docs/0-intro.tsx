import * as React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  Renders inline code snippets and code blocks.

  ## Examples

  ${(
    <Example
      Component={require('../examples/00-inline-code-basic').default}
      title="Inline Code"
      source={require('!!raw-loader!../examples/00-inline-code-basic')}
    />
  )}
`;
