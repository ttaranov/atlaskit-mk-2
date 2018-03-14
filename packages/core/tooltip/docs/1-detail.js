// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ${
    (
      // $FlowFixMe TEMPORARY
      <Example
        Component={require('../examples/position').default}
        source={require('!!raw-loader!../examples/position')}
        title="Position"
      />
    )
  }

  Tooltips have four positions available; "top", "right", "bottom", and "left".
  Each position center-aligns itself along the appropriate axis. Click the target
  above to see each position.

  ${(
    <Example
      Component={require('../examples/hover-intent').default}
      source={require('!!raw-loader!../examples/hover-intent')}
      title="Intent"
    />
  )}

  Tooltips should only appear when the user has paused on the target element.
  They should remain visible if the user briefly moves the mouse off and back
  on to the target.

  Similarly tooltips should not immediately disappear, unless the user hovers
  over another element with a tooltip.

  When the user scrolls, their attention is no longer on the tooltip. We take this
  opportunity to immediately hide the tooltip.

    * Mouse over, then off, a single target for a fade transition.
    * Mouse between each target for an immediate transition.
    * Mouse over, off briefly, then back over &mdash; there will be no transition.
    * Mouse over a target then scroll, the tooltip will be removed immediately.

  ${(
    <Example
      Component={require('../examples/css-position').default}
      source={require('!!raw-loader!../examples/css-position')}
      title="CSS Position"
    />
  )}

  Tooltips should understand the context that they're rendered in and position
  themselves appropriately.

  ${(
    <Example
      Component={require('../examples/scroll').default}
      source={require('!!raw-loader!../examples/scroll')}
      title="Scroll"
    />
  )}

  Tooltips should be aware of their ancestors' scroll distance and position
  themselves appropriately.
`;
