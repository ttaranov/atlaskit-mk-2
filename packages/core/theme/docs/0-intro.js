// @flow

import React, { type Node } from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import Lozenge from '@atlaskit/lozenge';

const Deprecated = ({ children }: { children: Node }) => (
  <h3>
    {children}{' '}
    <Lozenge appearance="removed" isBold>
      deprecated
    </Lozenge>
  </h3>
);

const Experimental = ({ children }: { children: Node }) => (
  <h3>
    {children} <Lozenge appearance="moved">experimental</Lozenge>
  </h3>
);

export default md`
  The theme package is a combined component and utility set, exporting abstractions for creating and consuming themes, as well as utilities for both audiences.

  ## For component consumers

  ${<Experimental>Reset</Experimental>}

  The \`Reset\` component applies CSS reset styles to select descendant nodes according to the ADG.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/reset').default}
      source={require('!!raw-loader!../examples/reset')}
      title="Reset"
    />
  )}

  As shown above, the \`Reset\` comes with defaults based on the ADG, but it also uses a \`Consumer\` internally which means you can wrap it in any number of providers to customise it.

  ${(
    <Example
      packageName="@atlaskit/theme"
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

  ___Unlike in the deprecated \`AtlaskitThemeProvider\`, this is not applied automatically - or globally - so it is up to you to put this in your app where appropriate.___

  ${<Deprecated>AtlaskitThemeProvider</Deprecated>}

  Theme provider is a wrapper component that accepts a 'mode'. This mode is passed down to styled components below it, using the styled components library theme provider, while also providing some defaults.

  Native Atlaskit components are set up to have both a 'light' mode and a 'dark' mode, and will respond to this, defaulting to the 'light' mode if no theme is provided.

  The AtlaskitThemeProvider should wrap your entire app, to ensure all components are set to the same theme. Mixing dark and light moded components will severely impact accessibility.

  ${(
    <Example
      packageName="@atlaskit/theme"
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

  ## For component authors

  ${<Experimental>Consumer</Experimental>}

  The raw \`Consumer\` returned by \`React.createContext()\`.

  To see the usage of a \`Consumer\` with a \`Theme\`, see the \`Theme\` API. We do export a raw \`Provider\` but it's likely you'll want the \`Theme\` component instead.

  ${<Experimental>Provider</Experimental>}

  The raw \`Provider\` returned by \`React.createContext()\`.

  ${<Experimental>Theme</Experimental>}

  The \`Theme\` component is at the center of the theming API.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Theme')}
    />
  )}

  #### Defining a theme

  When provided a subtree, the \`Theme\` component takes the values you provide and sets them on the new context.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/defining-a-theme').default}
      source={require('!!raw-loader!../examples/defining-a-theme')}
      title="Defining a theme"
    />
  )}

  #### Composing themes

  When themes are composed together, values in the ancestor context are merged with the provided values and are then set on the new context.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/composing-themes').default}
      source={require('!!raw-loader!../examples/composing-themes')}
      title="Composing themes"
    />
  )}

  #### Pre-defined themes

  To create a predefined theme, all you have to do is write a function that returns your theme object. The function is provided the parent theme and it is up to you to mix in the parent theme values into the new theme you're returning.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/pre-defined-themes').default}
      source={require('!!raw-loader!../examples/pre-defined-themes')}
      title="Pre-defined themes"
    />
  )}

  The example below shows the above example, but split out into two separate themes that are composed together.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/pre-defined-themes-composed').default}
      source={require('!!raw-loader!../examples/pre-defined-themes-composed')}
      title="Pre-defined themes (composed)"
    />
  )}

  #### Theming components

  To theme a specific component, you simply define a function as a value on your theme, and then you call that function in the component that requires the values from it.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/theming-components').default}
      source={require('!!raw-loader!../examples/theming-components')}
      title="Theming components"
    />
  )}

  #### Default themes

  Default themes are mostly the same as normal themes, except for that they mixin the ancestor component theme *after* the default theme declarations in the component theming function. This can be seen in the above example in the \`defaultButtonTheme\`.

  We recommend using \`defaultProps\` and a prop such as \`theme\` to apply the default theme for your components. This allows a consumer to pass a custom theme to the component using \`theme\` and you don't have to change your usage.

  ## For both authors and consumers

  ### colors

  An object containing the colors defined by the ADG color pallete. The available colors are shown below.

  ${(
    <Example
      packageName="@atlaskit/theme"
      Component={require('../examples/colors').default}
      source={require('!!raw-loader!../examples/colors')}
      title="colors"
    />
  )}

  ${<Deprecated>getTheme()</Deprecated>}

  Returns the current theme based on props. This has been deprecated in favour of simply accessing whatever you need using the \`Consumer\` or \`Theme\` components.

  _Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._

  ${<Deprecated>math</Deprecated>}

  Exports of curried functions that do math operations in styled component primitives. They have been deprecated in favour of performing your own mathematical operations using plain JavaScript.

  _Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._

  ${<Deprecated>themed()</Deprecated>}

  The \`themed()\` function is a way to define a theme for usage exclusively within Styled Component's primitives. Since we're moving to using React Context, this has been deprecated in favour of defining a theme with the \`Theme\` component.

  _Due to the fact that this helper was never documented and is now deprecated, we will not document its usage and this only serves as a notice that it will be removed in the future._
`;
