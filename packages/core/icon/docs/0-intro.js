// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ### Icons 🎉

  ${(
    <SectionMessage appearance="warning">
      <p>
        <strong>
          Version 14 removes a large number of icons from the icons package
        </strong>
      </p>
      <p>
        Please see our{' '}
        <a href="/packages/core/icon/docs/upgrading-icons-from-13-to-14">
          upgrade guide
        </a>{' '}
        for this version bump for more information.
      </p>
    </SectionMessage>
  )}

  The default export from this package is a wrapper which accepts a glyph
  property. Generally, you won't need this unless you're using your own custom
  icon.

${code`
import Icon from '@atlaskit/icon';
`}

  To use one of Atlaskit's built-in icons you should import it directly.

${code`
import BookIcon from '@atlaskit/icon/glyph/book';
`}

  You can explore all of our icons in the example below.

  ${(
    <Example
      packageName="@atlaskit/icon"
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
