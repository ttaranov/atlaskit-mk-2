import * as React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  # @atlaskit/smart-card

  Turns a URL into a card with metadata sourced from either:

  - a vendor or...
  - a custom fetch function that can be provided.

  ## Installation

  ~~~
  yarn add @atlaskit/smart-card
  ~~~

  _Note_: this package uses an AbortController, so you might need to provide a polyfill for that.

  ## Usage
  ${(
    <Example
      Component={require('../examples/0-intro').default}
      title="An editable example"
      source={require('!!raw-loader!../examples/0-intro')}
    />
  )}


`;
