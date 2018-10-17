// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>Note: @atlaskit/form is currently a developer preview.</strong>
    </p>
    <p>
      Please experiment with and test this package but be aware that the API may
      & probably will change with future releases.
    </p>
  </SectionMessage>
)}

  ### Form & Field Validation Examples

  Usage:
  ~~~js
  import Form { Field, Validator } from '@atlaskit/form';
  ~~~
  Validation is available for both the FormState & FieldState. If you don't need form state management or validation you will only need to import Field & Validator

  ${(
    <Example
      packageName="@atlaskit/form"
      Component={require('../examples/03-validators-example').default}
      title="Form & Field Validation"
      source={require('!!raw-loader!../examples/03-validators-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Field')}
      heading="Field Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Validator')}
      heading="Validator Props"
    />
  )}

`;
