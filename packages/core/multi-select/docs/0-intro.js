// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  React component which allows selection of multiple items from a dropdown list. Substitute for the native multiple select element

  ${(
    <SectionMessage appearance="warning">
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
    </SectionMessage>
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
