// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  # CSS Reset

  This package exports a CSS file which provides a minimal reset along with base styles for many HTML elements. It is meant to be used as a basis for all styling to be built upon.

  ## Installation

  \`\`\`
  npm install @atlaskit/css-reset
  \`\`\`

  ## Using the component

  ### Importing

  The @atlaskit/css-reset package can be consumed via the dist, or in Webpack.

  #### Importing in Webpack

  \`\`\`
  import '@atlaskit/css-reset';
  \`\`\`

  The Webpack style loader should then place the CSS within the HEAD of your HTML element.

  #### Importing in HTML

  \`\`\`
    <html>
      <head>
        <link rel="stylesheet" href="node_modules/@atlaskit/css-reset/dist/bundle.css" />
      </head>
      <body>
        <!-- ... -->
      </body>
    </html>
  \`\`\`

  ${(
    <Example
      Component={require('../examples/01-heading').default}
      title="Heading"
      source={require('!!raw-loader!../examples/01-heading')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-links').default}
      title="Links"
      source={require('!!raw-loader!../examples/02-links')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/03-lists-flat').default}
      title="Lists - flat"
      source={require('!!raw-loader!../examples/03-lists-flat')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/04-lists-nested').default}
      title="Lists - nested"
      source={require('!!raw-loader!../examples/04-lists-nested')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/05-tables-simple').default}
      title="Table - simple"
      source={require('!!raw-loader!../examples/05-tables-simple')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/06-tables-complex').default}
      title="Tables - complex"
      source={require('!!raw-loader!../examples/06-tables-complex')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/07-quotes').default}
      title="Quotes"
      source={require('!!raw-loader!../examples/07-quotes')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/08-code-and-pre').default}
      title="Code/ Pre"
      source={require('!!raw-loader!../examples/08-code-and-pre')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/09-misc-elements').default}
      title="Miscellaneous"
      source={require('!!raw-loader!../examples/09-misc-elements')}
    />
  )}

`;
