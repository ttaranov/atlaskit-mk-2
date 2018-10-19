// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Usage

  Provides a standard way to create a text-based form input with an associated label.

${code`
import FieldTextArea, { FieldTextAreaStateless } from '@atlaskit/field-text-area';
`}

  Text Field Area exports both a stateful default component, and a stateless
  component. The stateful component manages the value of the input for you
  and passes all other props on to the stateless version.

  ${(
    <Example
      packageName="@atlaskit/field-text-area"
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text-area"
      Component={require('../examples/01-stateless-example').default}
      title="Stateless Example"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text-area"
      Component={require('../examples/02-form-example').default}
      title="Form Example"
      source={require('!!raw-loader!../examples/02-form-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FieldTextArea')}
      heading="FieldTextArea Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FieldTextAreaStateless')}
      heading="FieldTextAreaStateless Props"
    />
  )}

`;
