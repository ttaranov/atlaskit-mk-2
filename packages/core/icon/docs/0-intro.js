// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Icons 🎉

  The default export from this package is a wrapper which accepts a glyph
  property. Generally, you won't need this unless you're using your own custom
  icon.

${code`
import Icon from '@atlaskit/icon';
`}

  To use one of Atlaskit's built-in icons you should import it directly.

${code`
import { AtlassianIcon } from '@atlaskit/logo';
`}

  You can explore all of our icons in the example below.

  ${(
    <Example
      Component={require('../examples/01-icon-explorer').default}
      title="Basic"
      source={require('!!raw-loader!../examples/01-icon-explorer')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Icon')}
    />
  )}
`;
