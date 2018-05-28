import * as React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  # @atlaskit/smart-card

  Turns a URL into a card with metadata sourced from the vendor.

  ## Installation

  ~~~
  yarn add @atlaskit/smart-card
  ~~~

  ## Usage
  ${(
    <Example
      Component={require('../examples/0-block').default}
      title="An editable example"
      source={require('!!raw-loader!../examples/0-block')}
    />
  )}

  ## API

  ### Client

  The smart card client is responsible for obtaining the metadata for a URL.

  #### Methods

  ##### .constructor(options?: ClientOptions)

  Creates a new smart card client.

  ##### .get(url: string, callback: (state: ObjectState) => void): ObjectStateStream

  Retrieve the object data for a URL.

  ### Provider

  The smart card provider is responsible for injecting the smart card client into the smart card components.

  #### Properties

  ##### .client?: Client

  The smart card client to be injected into the smart card components.

  ### Components

  #### BlockCard

  A connected component responsible for retrieving and rendering the metadata for a block smart card.

  ##### Properties

  ###### .client?: Client

  A smart card client that can be manually passed to the component.

  ###### .url: string

  The URL to retrieve and render metadata for.

  #### BlockCardView

  A view component that renders a block smart card.

  #### InlineCardView

  A view component that renders an inline smart card.

`;
