// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '../src';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/section-message is currently a developer preview."
    >
      Please experiment with and test this package, but be aware that the API
      may change at any time. Use at your own risk, preferrably not in
      production.
    </SectionMessage>
  )}

  ${code`import SectionMessage from '@atlaskit/section-message';`}

  Section messages are part of the content of a user interface, and are used to
  alert users of a particular screen area that needs user action. These
  notifications can appear within a page or dialog. They are not dismissible,
  and only disappear once the issue has been resolved.

  The section message component is quite simple in its implementation, with three
  different sections, a heading, a body, and actions.

  A section message will fill the width of its container.

  ${(
    <Example
      packageName="@atlaskit/section-message"
      title="Basic Example"
      Component={require('../examples/0-basic-example').default}
      source={require('!!raw-loader!../examples/0-basic-example')}
    />
  )}

  Section messages also have an appearance property for their different use-cases.

  ${(
    <Example
      packageName="@atlaskit/section-message"
      title="Appearance Variations"
      Component={require('../examples/appearance-variations').default}
      source={require('!!raw-loader!../examples/appearance-variations')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/SectionMessage')}
    />
  )}
`;
