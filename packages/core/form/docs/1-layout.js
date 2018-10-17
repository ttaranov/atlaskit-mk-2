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

  ### Form Layout Examples

  Usage:
  ~~~js
  import Form {
    FormHeader,
    FormSection,
    FormFooter
  } from '@atlaskit/form';
  ~~~

  FormHeader & FormFooter provide optional layout containers. If you are using Form then FormSection is required as a container
  for your Fields.
  
  ${(
    <Example
      packageName="@atlaskit/form"
      Component={require('../examples/00-form-layout-example').default}
      title="Form Layout"
      source={require('!!raw-loader!../examples/00-form-layout-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Form')}
      heading="Form Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FormHeader')}
      heading="FormHeader Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FormSection')}
      heading="FormSection Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FormFooter')}
      heading="FormFooter Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FieldGroup')}
      heading="FieldGroup Props"
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
