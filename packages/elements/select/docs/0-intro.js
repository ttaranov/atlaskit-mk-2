// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';

const Warning = p => (
  <div
    style={{
      backgroundColor: colors.Y75,
      boxShadow: `-4px 0 0 ${colors.Y200}`,
      marginBottom: '1.4em',
      padding: '1em 1.2em',
    }}
    {...p}
  />
);

export default md`
${(
  <Warning>
    <p>
      <strong>Note: @atlaskit/select is currently a developer preview.</strong>
    </p>
    <p>
      Please experiment with and test this package, but be aware that the API
      may change at any time. Use at your own risk, preferrably not in
      production.
    </p>
  </Warning>
)}

React component which allows selection of an item or items from a dropdown list.
  Substitute for the native select element.

  ${(
    <Example
      Component={require('../examples/00-single-select').default}
      source={require('!!raw-loader!../examples/00-single-select')}
      title="Single"
    />
  )}

  ${(
    <Example
      Component={require('../examples/01-multi-select').default}
      source={require('!!raw-loader!../examples/01-multi-select')}
      title="Multi"
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-radio-select').default}
      source={require('!!raw-loader!../examples/02-radio-select')}
      title="Radio"
    />
  )}

  ${(
    <Example
      Component={require('../examples/03-checkbox-select').default}
      source={require('!!raw-loader!../examples/03-checkbox-select')}
      title="Checkbox"
    />
  )}

  ${(
    <Example
      Component={require('../examples/04-formatters').default}
      source={require('!!raw-loader!../examples/04-formatters')}
      title="Formatters"
    />
  )}

  ${(
    <Props
      heading="Select Props"
      props={require('!!extract-react-types-loader!../src/Select')}
    />
  )}
`;
