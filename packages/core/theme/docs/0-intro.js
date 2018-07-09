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

  The raw \`Consumer\` returned by \`React.createContext()\`.

  To see the usage of a \`Consumer\` with a \`Theme\`, see the \`Theme\` API. We do export a raw \`Provider\` but it's likely you'll want the \`Theme\` component instead.

  ## \`Provider\`

  The raw \`Provider\` returned by \`React.createContext()\`.

  ## \`Theme\`

  The \`Theme\` component is at the center of the theming API.

  ### \`Defining a theme\`

  When provided a subtree, the \`Theme\` component takes the values you provide and sets them on the new context.

  ${(
    <Example
      Component={require('../examples/theme').default}
      source={require('!!raw-loader!../examples/theme')}
    />
  )}

  ### \`Composing themes\`

  When themes are composed together, values in the ancestor context are merged with the provided values and are then set on the new context.

  ${(
    <Example
      Component={require('../examples/theme-composed').default}
      source={require('!!raw-loader!../examples/theme-composed')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Theme')}
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

  The example below shows the above example, but split out into two separate themes that pass on \`props\` as described above.

  ${(
    <Example
      Component={require('../examples/pre-defined-themes-composed').default}
      source={require('!!raw-loader!../examples/pre-defined-themes-composed')}
    />
  )}

  ### Theming components

  When provided with a function as \`children\` (i.e. render prop), the \`Theme\` component passes in the current theming context. You may then render the descendant tree based on the theme.

  ${(
    <Example
      Component={require('../examples/theming-components').default}
      source={require('!!raw-loader!../examples/theming-components')}
    />
  )}

  There's a few things to note about the example shown above.

  1. It declares the default theme using a mixture of the two ways \`Theme\` can be invoked. This is so that the values it provides can be overridden by more specific themes, thus making them defaults.
  2. It uses default props to supply the default theme as the \`theme\` prop. This also allows a consumer to specify a custom theme directly, via the prop.

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
      Component={require('../examples/reset-with-theme').default}
      source={require('!!raw-loader!../examples/reset-with-theme')}
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
