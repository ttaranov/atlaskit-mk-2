// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package exports \`Tooltip\` and \`TooltipPrimitive\` components.

  You can wrap \`Tooltip\` around any other React component to display the given 
  \`content\` when the user hovers over the wrapped component.

  You can extend \`TooltipPrimitive\` to create a custom tooltip. It is
  a component with basic styles required by the tooltip. You can then pass this 
  custom tooltip in \`component\` prop to display it when user hovers over wrapper
  content of \`Tooltip\`.

  ${(
    <Example
      Component={require('../examples/basic').default}
      source={require('!!raw-loader!../examples/basic')}
      title="Basic Usage"
    />
  )}

  ### Fixes in \`7.0.0\`

  We have completely rewritten the logic for positioning tooltips, which now
  use our \`layer-manager\` component and portals to render above all other DOM
  elements on the page.

  This means that previous issues where tooltips are clipped by other UI should
  be comprehensively fixed; it also means we're not depending on Popper.js,
  which dramatically improves package weight and performance.

  ### Breaking Changes in \`7.0.0\`

  #### Stateless version removed

  Tooltip previously exported both the \`Tooltip\` component, and a stateless
  version as a named export \`TooltipStateless\`. The stateless version has been
  removed as of version \`7.0.0\`.

  #### Changes to Props

  * \`description\` has been renamed to \`content\`

  In \`7.0.0\` the old props are still supported for backwards-compatibility,
  but will log a deprecation warning. Support will be removed from version
  \`8.0.0\` onwards.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Tooltip')}
    />
  )}
`;
