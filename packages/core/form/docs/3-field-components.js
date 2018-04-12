// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';
import { fieldComponents } from '../src/data/fieldComponents';
import ComponentsTable from '../src/utils/ComponentsTable';

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

  ### Supported Atlaskit Components

  The following table lists all the currently supported components and any known issues.
  
  ${<ComponentsTable components={fieldComponents} />}

  ${(
    <Example
      Component={require('../examples/01-form-fields-example').default}
      title="Fields"
      source={require('!!raw-loader!../examples/01-form-fields-example')}
    />
  )}


`;
