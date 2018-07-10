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
      title="colors"
    />
  )}

  ## \`Consumer\`

  The raw \`Consumer\` returned by \`React.createContext()\`.

  To see the usage of a \`Consumer\` with a \`Theme\`, see the \`Theme\` API. We do export a raw \`Provider\` but it's likely you'll want the \`Theme\` component instead.

  ## \`Provider\`

  The raw \`Provider\` returned by \`React.createContext()\`.

  ## \`Theme\`

  The \`Theme\` component is at the center of the theming API.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Theme')}
    />
  )}

  ### \`Defining a theme\`

  When provided a subtree, the \`Theme\` component takes the values you provide and sets them on the new context.

  ${(
    <Example
      Component={require('../examples/defining-a-theme').default}
      source={require('!!raw-loader!../examples/defining-a-theme')}
      title="Defining a theme"
    />
  )}

  ### \`Composing themes\`

  When themes are composed together, values in the ancestor context are merged with the provided values and are then set on the new context.

  ${(
    <Example
      Component={require('../examples/composing-themes').default}
      source={require('!!raw-loader!../examples/composing-themes')}
      title="Composing themes"
    />
  )}

  ### Pre-defined themes

  To create a predefined theme, all you have to do is create a component that uses a \`Provider\` internally.

  ${(
    <Example
      Component={require('../examples/pre-defined-themes').default}
      source={require('!!raw-loader!../examples/pre-defined-themes')}
      title="Pre-defined themes"
    />
  )}

  You'll definitely need to pass on \`children\` but it's up to you whether or not you want to pass along other \`props\`. We recommend you do because themes become more composable and are able to be mixed and matched. They're just components, after all.

  The example below shows the above example, but split out into two separate themes that pass on \`props\` as described above.

  ${(
    <Example
      Component={require('../examples/pre-defined-themes-composed').default}
      source={require('!!raw-loader!../examples/pre-defined-themes-composed')}
      title="Pre-defined themes (composed)"
    />
  )}

  ### Theming components

  When provided with a function as \`children\` (i.e. render prop), the \`Theme\` component passes in the current theming context. You may then render the descendant tree based on the theme.

  ${(
    <Example
      Component={require('../examples/theming-components').default}
      source={require('!!raw-loader!../examples/theming-components')}
      title="Theming components"
    />
  )}

  ### Default themes

  Default themes are mostly the same as normal themes, except for that they mixin the ancestor component theme *after* the default theme declarations in the component theming function. This can be seen in the above example in the \`DefaultButtonTheme\`.

  We recommend using \`defaultProps\` and a prop such as \`theme\` to apply the default theme for your components. This allows a consumer to pass a custom theme to the component using \`theme\` and you don't have to change your usage. You can also see this in the example above where it calls out to \`<props.theme />\`.
  
  ## \`Reset\`

  The \`Reset\` component allows you to reset the styles for a particular node tree. Unlike the deprecated \`AtlaskitThemeProvider\`, this is not applied automatically, so it is up to you to put this in your app where appropriate.

  ${(
    <Example
      Component={require('../examples/reset').default}
      source={require('!!raw-loader!../examples/reset')}
      title="Reset"
    />
  )}

  As shown above, the \`Reset\` comes with a base set of styles but a \`Reset\` uses a \`Consumer\` internally which means you can wrap it in any number of providers to customise it.

  ${(
    <Example
      Component={require('../examples/themed-reset').default}
      source={require('!!raw-loader!../examples/themed-reset')}
      title="Themed reset"
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
      title="DEPRECATED AtlaskitThemeProvider"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/AtlaskitThemeProvider')}
    />
  )}
`;
