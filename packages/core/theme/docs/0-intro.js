// @flow
import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';
import Lozenge from '@atlaskit/lozenge';

const Deprecated = ({ children }: { children: React.Node }) => (
  <h2>
    <code>{children}</code>{' '}
    <Lozenge appearance="removed" isBold>
      deprecated
    </Lozenge>
  </h2>
);

export default md`
  Theme is a combined component and utility set, exporting a main component for use and as well as a number of helper methods to allow easy application of atlaskit's themes.

  ## \`colors\`

  An object containing the colors defined by the ADG color pallete. The available colors are shown below.

  ${(
    <Example
      Component={require('../examples/colors').default}
      source={require('!!raw-loader!../examples/colors')}
    />
  )}

  ## \`Consumer\`

  The \`Consumer\` component takes a function as children and executes it with the current theme props. If there are no providers declared around a consumer, it will return an empty object.

  ${(
    <Example
      Component={require('../examples/consumer').default}
      source={require('!!raw-loader!../examples/consumer')}
    />
  )}

  To see the usage of a \`Consumer\` with a \`Provider\`, see the \`Provider\` API.

  ## \`Provider\`

  The \`Provider\` component allows you to define a theme by wrapping it around the tree you want to provide theme props to. The \`Consumer\` is then used to retrieve the provided theme props.

  ${(
    <Example
      Component={require('../examples/provider').default}
      source={require('!!raw-loader!../examples/provider')}
    />
  )}

  Providers can be composed together. The values from the inner-most \`Provider\` take precedence.

  ${(
    <Example
      Component={require('../examples/provider-composed').default}
      source={require('!!raw-loader!../examples/provider-composed')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Provider')}
    />
  )}

  ### Pre-defined themes

  To create a predefined theme, all you have to do is create a component that uses a \`Provider\` internally.

  ${(
    <Example
      Component={require('../examples/pre-defined-themes').default}
      source={require('!!raw-loader!../examples/pre-defined-themes')}
    />
  )}

  You'll definitely need to pass on \`children\` but it's up to you whether or not you want to pass along other \`props\`. We recommend you do because themes become more composable and are able to be mixed and matched. They're just components, after all.

  ${(
    <Example
      Component={require('../examples/pre-defined-themes-composed').default}
      source={require('!!raw-loader!../examples/pre-defined-themes-composed')}
    />
  )}

  ### Theming components

  ${(
    <Example
      Component={require('../examples/theming-components').default}
      source={require('!!raw-loader!../examples/theming-components')}
    />
  )}

  ## \`Reset\`

  The \`Reset\` component allows you to reset the styles for a particular node tree. Unlike the deprecated \`AtlaskitThemeProvider\`, this is not applied automatically, so it is up to you to put this in your app where appropriate.

  ${(
    <Example
      Component={require('../examples/reset').default}
      source={require('!!raw-loader!../examples/reset')}
    />
  )}

  As shown above, the \`Reset\` comes with a base set of styles but a \`Reset\` uses a \`Consumer\` internally which means you can wrap it in any number of providers to customise it.

  ${(
    <Example
      Component={require('../examples/reset-with-provider').default}
      source={require('!!raw-loader!../examples/reset-with-provider')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Reset')}
    />
  )}

  ${<Deprecated>AtlaskitThemeProvider</Deprecated>}

  Theme provider is a wrapper component that accepts a 'mode'. This mode is passed down to styled components below it, using the styled components library theme provider, while also providing some defaults.

  Native Atlaskit components are set up to have both a 'light' mode and a 'dark' mode, and will respond to this, defaulting to the 'light' mode if no theme is provided.

  The AtlaskitThemeProvider should wrap your entire app, to ensure all components are set to the same theme. Mixing dark and light moded components will severely impact accessibility.

  ${(
    <Example
      Component={require('../examples/deprecated-theme-provider').default}
      source={require('!!raw-loader!../examples/deprecated-theme-provider')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/AtlaskitThemeProvider')}
    />
  )}
`;
