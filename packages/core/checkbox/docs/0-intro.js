// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Usage

  A checkbox element for use in forms and elsewhere.

${code`
import Checkbox, {
  CheckboxInput,
  CheckboxIcon
} from '@atlaskit/checkbox';
`}

  The default export Checkbox provides for controlled & uncontrolled usuage and includes label, input & icon.
  
  ${(
    <Example
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/01-controlled').default}
      title="Controlled Checkbox"
      source={require('!!raw-loader!../examples/01-controlled')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-indeterminate').default}
      title="Indeterminate"
      source={require('!!raw-loader!../examples/02-indeterminate')}
    />
  )}


  ${(
    <Example
      Component={require('../examples/04-checkbox-form').default}
      title="With a Form"
      source={require('!!raw-loader!../examples/04-checkbox-form')}
    />
  )}

  ## Checkbox Props
  ${<Props props={require('!!extract-react-types-loader!../src/Checkbox')} />}

  ## CheckboxIcon Props
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/CheckboxIcon')}
    />
  )}


`;
