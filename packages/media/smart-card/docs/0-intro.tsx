import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  # @atlaskit/smart-card

  Turns a URL into a card with metadata sourced from the vendor.

  ## Installation

  ~~~
  yarn add @atlaskit/smart-card
  ~~~

  **Note:** A [fetch](https://www.npmjs.com/package/whatwg-fetch) polyfill is required on IE11.

  ## Usage
  ${(
    <Example
      Component={require('../examples/0-simple').default}
      title="A simple example"
      source={require('!!raw-loader!../examples/0-simple')}
    />
  )}

  ## API 

  ### Client

  The smart card client is responsible for obtaining the metadata for a URL.

  #### Methods

  ##### .constructor(options?: ClientOptions)

  Creates a new smart card client.

  ##### .get(url: string): Info

  Get the metadata for a URL.

  ### Provider

  The smart card provider is responsible for injecting the smart card client into the smart card components.

  #### Properties

  ##### .client?: Client

  The smart card client to be injected into the smart card components.

  ### Card

  The smart card is responsible for rendering the metadata retrieved about the URL and is also responsible user interaction.

  #### Properties

  ##### .client?: Client

  A smart card client manually passed to the smart card component.

  ##### .url: string

  The URL to retrieve and render metadata for.

  ### CardView

  The smart card view is responsible for rendering the metadata passed

`;
