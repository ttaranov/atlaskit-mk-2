// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This component displays content in a layer that sits above the rest of the page content. Users won't be able to interact with the page until the dialog is closed.

  ## Examples

  ${(
    <Example
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/1-appearance').default}
      title="Appearance"
      source={require('!!raw-loader!../examples/1-appearance')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/2-custom').default}
      title="Custom"
      source={require('!!raw-loader!../examples/2-custom')}
    />
  )}


  ${(
    <Props
      heading={'Modal Dialog Props'}
      props={require('!!extract-react-types-loader!../src/components/Modal')}
    />
  )}
`;
