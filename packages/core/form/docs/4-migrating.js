// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';
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
      <strong>Note: @atlaskit/form is currently a developer preview.</strong>
    </p>
    <p>
      Please experiment with and test this package but be aware that the API may
      & probably will change with future releases.
    </p>
  </Warning>
)}

  ### Migrating existing forms (WIP)

  If you have forms already using Atlaskit form components then you can migrate them relelatively easily to
  use the Form package.

  ${(
    <Example
      Component={require('../examples/01-form-fields-example').default}
      title="Fields"
      source={require('!!raw-loader!../examples/01-form-fields-example')}
    />
  )}


`;
