// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This component displays content in a layer that sits above the rest of the page content. Users won't be able to interact with the page until the dialog is closed.

  ## Examples

  ${(
    <Example
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/10-appearance').default}
      title="Appearance"
      source={require('!!raw-loader!../examples/10-appearance')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/15-custom').default}
      title="Custom"
      source={require('!!raw-loader!../examples/15-custom')}
    />
  )}


  ${(
    <Props
      heading={'Modal Dialog Props'}
      props={require('!!extract-react-types-loader!../src/components/Modal')}
    />
  )}
`;
