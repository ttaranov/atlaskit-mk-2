// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Renders inline code snippets and code blocks.
  
  ${(
    <Example
      packageName="@atlaskit/code"
      Component={require('../examples/00-inline-code-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-inline-code-basic')}
    />
  )}

  ${(
    <Props
      heading={'Code Props'}
      props={require('!!extract-react-types-loader!../src/Code')}
    />
  )}

  ${(
    <Props
      heading={'CodeBlock Props'}
      props={require('!!extract-react-types-loader!../src/CodeBlock')}
    />
  )}
`;
