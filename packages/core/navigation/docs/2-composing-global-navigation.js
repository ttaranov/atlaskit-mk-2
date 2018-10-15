// @flow
import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
  **DEPRECATED** - This package is deprecated. We recommend using [@atlaskit/navigation-next](https://atlaskit.atlassian.com/packages/core/navigation-next) instead.

  There is a specific \`AkGlobalItem\` component that is designed to be used in the
  \`globalSecondaryActions\` prop for navigation. Wrapping an icon, possibly
  with a tooltip insie a \`AkGlobalItem\` component will ensure the correct
  styling behaviour for the item.

  ${(
    <Props
      shouldCollapseProps
      heading="Global Navigation Item"
      props={require('!!extract-react-types-loader!../src/components/js/GlobalItem.js')}
    />
  )}

  If you want to render GlobalNavigation only, it is exported as \`AkGlobalNavigation\`.

  ${(
    <Props
      shouldCollapseProps
      heading="Global Navigation"
      props={require('!!extract-react-types-loader!../src/components/js/GlobalNavigation.js')}
    />
  )}


`;
