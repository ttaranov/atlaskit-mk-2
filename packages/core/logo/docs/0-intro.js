// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Use the logo component to output SVG versions of the company and product logos.

  If you are not using tree-shaking, and are importing logos, you should likely use the
  direct path to the logos file. [this example](/example/getAbsolutePath) will give you
  the exact path you need.

  ## Examples

  ${(
    <Example
      packageName="@atlaskit/logo"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/AtlassianLogo/Logo')}
    />
  )}

`;
