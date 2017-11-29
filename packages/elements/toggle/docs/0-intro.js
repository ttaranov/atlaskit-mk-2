// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  A Toggle component. It is a checkbox displayed in an alternative way.

  ## Examples

  The default export is a component that you can control and listen to events on

  ${(
    <Example
      Component={require('../examples/0-stateful').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-stateful')}
    />
  )}

  We also provide a stateless version of the component which allows you the ability
  to control whether the toggle is checked or not programatically

  ${(
    <Example
      Component={require('../examples/1-stateless').default}
      title="Stateless"
      source={require('!!raw-loader!../examples/1-stateless')}
    />
  )}

  ## Props

  > Currently this is not provided as we are experiencing a flow type generation issue
`;
