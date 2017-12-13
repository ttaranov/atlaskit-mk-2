// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  ## Justification
  The layer manager is used to render React DOM into a new context (aka "Portal").
  This can be used to implement various UI components such as modals.

  The impetus for creating this package was the constant war with z-indexes.
  When you wrap your app in a \`<LayerManager />\` it will create slots for each
  package that is supported, and portal each instance to the correct slot when
  rendered inside your react app.

  ## Usage
  Super simple to use, just wrap your app with the default export -- we'll listen
  to the context it broadcasts, and inject your components where they belong.

  \`\`\`
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
  \`\`\`

  ${(
    <Example
      Component={require('../examples/basic').default}
      source={require('!!raw-loader!../examples/basic')}
      title="Supported Packages"
    />
  )}

  ## Helpers
  There are a few patterns that are common among the supported components. We've
  abstracted them for use under \`@atlaskit/layer-manager\`.

  ${(
    <Example
      Component={require('../examples/scroll-lock').default}
      source={require('!!raw-loader!../examples/scroll-lock')}
      title="Scroll Lock"
    />
  )}

  ${(
    <Example
      Component={require('../examples/focus-lock').default}
      source={require('!!raw-loader!../examples/focus-lock')}
      title="Focus Lock"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/LayerManager')}
    />
  )}
`;
