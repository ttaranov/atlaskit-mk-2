// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';

const Warning = p => (
  <div
    style={{
      backgroundColor: colors.R75,
      boxShadow: `-4px 0 0 ${colors.R200}`,
      marginBottom: '1.4em',
      padding: '1em 1.2em',
    }}
    {...p}
  />
);

export default md`
  React component which allows selection of multiple items from a dropdown list. Substitute for the native multiple select element

  ${(
    <Warning>
      <p>
        <strong>
          Note: @atlaskit/multi-select will be deprecated by the 13th of June
          2018
        </strong>
      </p>
      <p>
        Please upgrade to @atlaskit/select, for any upgrade concerns please ping
        the Select Upgrade room on stride.
      </p>
    </Warning>
  )}

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
      heading={'Stateful MultiSelect Props'}
      props={require('!!extract-react-types-loader!../src/components/Stateful')}
    />
  )}
`;
