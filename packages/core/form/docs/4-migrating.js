// @flow
import React from 'react';
import { md } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';
import { Link } from 'react-router-dom';

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

  ### Migrating existing forms

  If you have forms already using Atlaskit form components then you can migrate them relelatively easily to
  use the Form package.

  ${(
    <ol>
      <li>
        <Link to="field-components">
          Check your field component is supported
        </Link>
      </li>
      <li>
        <Link to="field-components">
          Wrap your field component in &lt; Field &gt; using the sample code
          here as a reference
        </Link>
      </li>
      <li>
        <Link to="validation">
          Optional: Add validators to your fields and forms
        </Link>
      </li>
    </ol>
  )}


`;
