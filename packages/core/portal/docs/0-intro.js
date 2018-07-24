// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
// # Portal
//
// ${(
//   <SectionMessage
//     appearance="warning"
//     title="Note: @atlaskit/portal is currently a developer preview."
//   >
//     Please experiment with and test this package, but be aware that the API
//     may change at any time. Use at your own risk, preferrably not in
//     production.
//   </SectionMessage>
// )}

export default md`
  An Atlaskit opinionated wrapper on [React Portals](https://reactjs.org/docs/portals.html).

  Portals are used for rendering parts of a React component tree into a different
  part of the DOM. This is particularly useful for UI components that need
  to appear over the top of other components. Examples of these components are
  \`@atlaskit/modal-dialog\`, \`@atlaskit/flag\` and \`@atlaskit/tooltip\`.

  This package does two things. It provides a way of rendering React components into Portals.
  It introduces the concept of layering to Portals. Layering is used to ensure that components
  appear in a natural order. There are four layers which stack in the following order:

  1. Tooltip
  2. Flag
  3. Spotlight
  4. Default (used for all other components)

  This means that all components on the \`tooltip\` layer will appear above those
  on the \`flag\` layer, components on the \`spotlight\` layer will appear above
  the \`default\` layer, etc.

  ## Usage

  This package was primarily designed for components inside the Atlaskit repository. All
  Atlaskit components layer correctly out-of-the-box. If you have a use-case for
  this component, we would love to hear from you. You can let us know [here](https://ecosystem.atlassian.net/servicedesk/customer/portal/24/create/237).

  This example renders a \`<div />\` and \`<h2 />\` into the \`default\` Portal layer.

  ${code`
import React from 'react';
import Portal from '@atlaskit/portal';

const Modal = () => (
  <Portal>
    <div>
      <h2>Modal dialog heading</h2>
    </div>
  </Portal>
)
`}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Portal')}
    />
  )}
`;
