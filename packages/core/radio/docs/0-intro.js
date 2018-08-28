// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Usage

  Provides a standard way to select a single option from a list.

${code`
import RadioGroup, { AkFieldRadioGroup, AkRadio } from '@atlaskit/field-radio-group';
`}

  RadioGroup exports a stateful component as the default export. This
  handles the selection of items for you. You can also import a stateless
  version as AkFieldRadioGroup.

  Both accept a list of items that pass the properties on to a
AkRadio component to render. Both stateful and stateless
  maintain the state of their children AkRadio components.

  ${(
    <Example
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/01-controlled-example').default}
      title="Stateless Checkbox"
      source={require('!!raw-loader!../examples/01-controlled-example')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-form-example').default}
      title="With a Form"
      source={require('!!raw-loader!../examples/02-form-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/RadioGroup')}
      heading="RadioGroup Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/RadioInput')}
      heading="RadioInput Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Radio')}
      heading="Radio Props"
    />
  )}

`;
