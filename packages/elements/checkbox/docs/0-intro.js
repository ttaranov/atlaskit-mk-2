// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  ### Usage

  A checkbox element for use in forms and elsewhere. 

    ~~~js
    import Checkbox, {
        CheckboxStateless,
        CheckboxGroup
    } from '@atlaskit/checkbox';
    ~~~

  There is a stateful default export that manages the checked state of the checkbox, and a
  stateless version that allows you to control changes in the checked state
  directly. There is also a wrapper component to display checkboxes in a
  group.

  ${(
    <Example
      Component={require('../examples/00-basic-usage').default}
      title="Basic Usage"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/01-checkbox').default}
      title="Basic Usage"
      source={require('!!raw-loader!../examples/01-checkbox')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-stateless-checkbox').default}
      title="AvatarGroup"
      source={require('!!raw-loader!../examples/02-stateless-checkbox')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/03-checkbox-group').default}
      title="Presence"
      source={require('!!raw-loader!../examples/03-checkbox-group')}
    />
  )}

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
