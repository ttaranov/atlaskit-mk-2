// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  React component which allows selection of multiple items from a dropdown list. Substitute for the native multiple select element

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
      Component={require('../examples/01-groupless').default}
      title="Appearance"
      source={require('!!raw-loader!../examples/01-groupless')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-stateless').default}
      title="Custom"
      source={require('!!raw-loader!../examples/02-stateless')}
    />
  )}

  ${(
    <Props
      heading={'Statefil MultiSelect Props'}
      props={require('!!extract-react-types-loader!../src/components/Stateful')}
    />
  )}
`;
