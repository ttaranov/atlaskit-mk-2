// @flow
import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`
  ## Why?
  The layer manager is used to render React DOM into a new context (aka "Portal").
  This can be used to implement various UI components such as modals.

  The impetus for creating this package was the constant war with z-indexes.
  When you wrap your app in a \`<LayerManager />\` it will create slots for each
  package that is supported, and portal each instance to the correct slot when
  rendered inside your react app.

  ## Usage
  Super simple to use, just wrap your app with the default export -- we'll listen
  to the context it broadcasts, and inject your components where they belong.

${code`
import LayerManager from '@atlaskit/layer-manager';

export default class App extends Component {
  render() {
    return (
      <LayerManager>
        ...
      </LayerManager>
    );
  }
}
`}

  ${(
    <Example
      Component={require('../examples/0-basic').default}
      source={require('!!raw-loader!../examples/0-basic')}
      title="Supported Components"
    />
  )}

  ## Helpers
  There are a few patterns that are common among the supported packages, and have
  been abstracted into discrete components. While primarily for use internally,
  they're available as named exports from \`@atlaskit/layer-manager\`.

  ${(
    <Example
      Component={require('../examples/1-scroll-lock').default}
      source={require('!!raw-loader!../examples/1-scroll-lock')}
      title="Scroll Lock"
    />
  )}

  ${(
    <Example
      Component={require('../examples/2-focus-lock').default}
      source={require('!!raw-loader!../examples/2-focus-lock')}
      title="Focus Lock"
    />
  )}

  ${(
    <Example
      Component={require('../examples/3-with-context').default}
      source={require('!!raw-loader!../examples/3-with-context')}
      title="With Context from Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/LayerManager')}
    />
  )}
`;
