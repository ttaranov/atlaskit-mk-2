// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Usage

  A checkbox element for use in forms and elsewhere.

${code`
import Checkbox, {
  CheckboxStateless,
  CheckboxGroup
} from '@atlaskit/checkbox';
`}

  There is a stateful default export that manages the checked state of the checkbox, and a
  stateless version that allows you to control changes in the checked state
  directly. There is also a wrapper component to display checkboxes in a
  group.

  ${
    (
      // $FlowFixMe TEMPORARY
      <Example
        Component={require('../examples/00-basic-usage').default}
        title="Basic"
        source={require('!!raw-loader!../examples/00-basic-usage')}
      />
    )
  }

  ${
    (
      // $FlowFixMe TEMPORARY
      <Example
        Component={require('../examples/01-stateless-checkbox').default}
        title="Stateless Checkbox"
        source={require('!!raw-loader!../examples/01-stateless-checkbox')}
      />
    )
  }

  ${
    (
      // $FlowFixMe TEMPORARY
      <Example
        Component={require('../examples/02-indeterminate').default}
        title="Indeterminate"
        source={require('!!raw-loader!../examples/02-indeterminate')}
      />
    )
  }

  ${
    (
      // $FlowFixMe TEMPORARY
      <Example
        Component={require('../examples/03-checkbox-group').default}
        title="With CheckboxGroup"
        source={require('!!raw-loader!../examples/03-checkbox-group')}
      />
    )
  }

  ${
    (
      // $FlowFixMe TEMPORARY
      <Example
        Component={require('../examples/04-checkbox-form').default}
        title="With a Form"
        source={require('!!raw-loader!../examples/04-checkbox-form')}
      />
    )
  }

  ## Checkbox Props

  ${<Props props={require('!!extract-react-types-loader!../src/Checkbox')} />}

  ## CheckboxStateless Props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/CheckboxStateless')}
    />
  )}

## CheckboxGroup Props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/CheckboxGroup')}
    />
  )}

`;
