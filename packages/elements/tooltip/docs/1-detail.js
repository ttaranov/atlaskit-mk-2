// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ${<Example
    Component={require('../examples/placement').default}
    source={require('!!raw-loader!../examples/placement')}
    title="Placement"
  />}

  Tooltips have four placements available; "top", "right", "bottom", and "left".
  Each placement center-aligns itself along the appropriate axis. Click the target
  above to see each placement.

  ${<Example
    Component={require('../examples/hover-intent').default}
    source={require('!!raw-loader!../examples/hover-intent')}
    title="Hover Intent"
  />}

  Tooltips should only appear when the user has paused on the target element.
  They should remain visible if the user briefly moves the mouse off and back
  on to the target.

  Similarly tooltips should not immediately disappear, unless the user hovers
  over another element with a tooltip.

    * Mouse over, then off, a single target for a fade transition.
    * Mouse between each target for an immediate transition.
    * Mouse over, off briefly, then back over &mdash; there will be no transition.
`;
