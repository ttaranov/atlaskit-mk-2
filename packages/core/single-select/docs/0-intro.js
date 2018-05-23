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
  React component which allows selection of a single item from a dropdown list. Substitute for the native select element

  ${(
    <Warning>
      <p>
        <strong>
          Note: @atlaskit/single-select will be deprecated by the 13th of June
          2018
        </strong>
      </p>
      <p>
        Please upgrade to @atlaskit/select, for any upgrade concerns please ping
        the Select Upgrade room on stride.
      </p>
    </Warning>
  )}
  
  ${(
    <Example
      Component={require('../examples/00-basic').default}
      source={require('!!raw-loader!../examples/00-basic')}
      title="Basic Usage"
    />
  )}

  ${(
    <Example
      Component={require('../examples/01-stateless').default}
      source={require('!!raw-loader!../examples/01-stateless')}
      title="Custom Usage with Stateless Select"
    />
  )}

  ${(
    <Props
      heading={'Stateful Props'}
      props={require('!!extract-react-types-loader!../src/components/SingleSelect')}
    />
  )}

  ${(
    <Props
      heading={'Stateless Props'}
      props={require('!!extract-react-types-loader!../src/components/StatelessSelect')}
    />
  )}
`;
