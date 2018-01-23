// @flow

import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package exports a number of basic components that can be used to assemble skeleton loading states.
  These primitives are lightweight representations of other components and serve to give an early indication
  to users of what's going on while the real interface is loading.

  ${(
    <Example
      Component={require('../examples/01-basic').default}
      title="Basic components"
      source={require('!!raw-loader!../examples/01-basic')}
    />
  )}

  All the components in this package allow their color to be set either directly via the \`color\` prop,
  or by inheriting the current text color. The \`appearance\` prop can also be used to emphasise important
  parts of the skeleton.

  ${(
    <Example
      Component={require('../examples/02-styling').default}
      title="Styling examples"
      source={require('!!raw-loader!../examples/02-styling')}
    />
  )}

  ${(
    <Props
      heading="Paragraph Skeleton Props"
      props={require('!!extract-react-types-loader!../src/components/Paragraph')}
    />
  )}

  ${(
    <Props
      heading="Icon Skeleton Props"
      props={require('!!extract-react-types-loader!../src/components/Icon')}
    />
  )}

  ${(
    <Props
      heading="Avatar Skeleton Props"
      props={require('!!extract-react-types-loader!../src/components/Avatar')}
    />
  )}
`;
