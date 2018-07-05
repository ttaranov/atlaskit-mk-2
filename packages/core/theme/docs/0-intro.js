// @flow
import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';
import Lozenge from '@atlaskit/lozenge';

const Deprecated = ({ children }) => (
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
      title="colors"
      source={require('!!raw-loader!../examples/colors')}
    />
  )}

  ${<Deprecated>AtlaskitThemeProvider</Deprecated>}

  Theme provider is a wrapper component that accepts a 'mode'. This mode is passed down to styled components below it, using the styled components library theme provider, while also providing some defaults.

  Native Atlaskit components are set up to have both a 'light' mode and a 'dark' mode, and will respond to this, defaulting to the 'light' mode if no theme is provided.

  The AtlaskitThemeProvider should wrap your entire app, to ensure all components are set to the same theme. Mixing dark and light moded components will severely impact accessibility.

  ${(
    <Example
      Component={require('../examples/deprecated-theme-provider').default}
      title="Theme Provider Example"
      source={require('!!raw-loader!../examples/deprecated-theme-provider')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/AtlaskitThemeProvider')}
    />
  )}

  ### Migration

  The usage of \`AtlaskitThemeProvider\` is now deprecated because it limited theming to a single \`mode\` prop and did too many things (resets _and_ theming). The reset also side-effected the \`body\` which we want to avoid if possible.
  
  Instead, we now export a \`Reset\` separately that you must put inside of your theme around the content you want to reset. You'll probably do this at the outermost presentational point in your app.

  ${(
    <Example
      Component={require('../examples/theme').default}
      title="Theme Provider Example"
      source={require('!!raw-loader!../examples/theme')}
    />
  )}
`;
