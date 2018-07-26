// @flow
import React from 'react';
import { md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import { Link } from 'react-router-dom';

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

  ### Usage
  The Form package provides form & field state, layout and validation and can be imported using:
  ~~~js
  import Form {
    FormHeader,
    FormSection,
    FormFooter
    Field,
    FieldGroup,
    Validator
  } from '@atlaskit/form';
  ~~~

  Layout & state management can be implemented using **Form**, **FormHeader**, **FormSection** & **FormFooter** components.
  If you have existing form wrappers then **Field**, **FieldGroup** & **Validator** can still be used to provide validation via
  validator libs, custom validator functions or Regular expressions.

   ### Getting Started
${(
  <ul>
    <li>
      <Link to="form/docs/form-builder">
        Use Form Builder to generate a new form
      </Link>{' '}
      (WIP)
    </li>
    <li>
      <Link to="form/docs/migrating">
        Migrate an existing form that uses Atlaskit components
      </Link>
    </li>
    <li>
      <Link to="form/docs/validation">
        Using Field Validators within your own &lt;form&gt; wrapper
      </Link>
    </li>
  </ul>
)}
   ### More Examples & Reference
${(
  <ul>
    <li>
      <Link to="form/docs/layout">Form layout</Link>
    </li>
    <li>
      <Link to="form/docs/validation">Form & Field Validation</Link>
    </li>
    <li>
      <Link to="form/docs/field-components">Supported Atlaskit Components</Link>
    </li>
    <li>Designing better forms</li>
  </ul>
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
