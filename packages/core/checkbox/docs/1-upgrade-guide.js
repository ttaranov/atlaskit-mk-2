// @flow
import React from 'react';
import { md, Example, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  @atlaskit/checkbox 5.x is part of an ongoing body of work to normalise atlaskit form components.
  There are a few breaking changes you need to be aware of in upgrading from 4.x to 5.x.

  ## Exports
  @atlaskit/checkbox no longer specifies the Checkbox component as the default export.
  Moreover the following changes have been made to exports from the @atlaskit/checkbox package.

  ### Checkbox:
  Checkbox is now a **named** export of the @atlaskit/checkbox package. Please import it as below.

  ${code`import { Checkbox } from @atlaskit/checkbox;`}

  The Checkbox component is now a conditionally controlled component, the **isChecked** prop is exposed for users to control the checked state of the component.
  This was the sole reason for having the CheckboxStateless component in pre 5.x, and as a result leveraging this pattern allows us to do away with the CheckboxStateless component.

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/01-controlled').default}
      title="Controlled"
      source={require('!!raw-loader!../examples/01-controlled')}
    />
  )}

  To let the component take care of checked state, leave the isChecked prop unset, or explicitly set it to undefined.

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/02-uncontrolled').default}
      title="Uncontrolled"
      source={require('!!raw-loader!../examples/02-uncontrolled')}
    />
  )}


  Additionally, one can control the initial checked state of a component by setting the **defaultChecked** (boolean) prop.
  This is used as the initial value of the internal 'isChecked' property in state. This value will be overridden by additional user interactions with the component.

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/05-default-checked').default}
      title="Default Checked"
      source={require('!!raw-loader!../examples/05-default-checked')}
    />
  )}

  ### CheckboxStateless

  ${(
    <SectionMessage title="Deprecated Component" appearance="error">
      {
        'This component has been deprecated in favor of the conditionally controlled component pattern specified above.**'
      }
    </SectionMessage>
  )}

  ### CheckboxGroup:

  ${(
    <SectionMessage title="Deprecated Component" appearance="error">
      {`
        @atlaskit/checkbox no longer exports a CheckboxGroup component. It has been removed for the following reasons:
        - It was really a thin wrapper enforcing very basic styling opinions over its children (display: flex, flex: column)
        - The existing styling blocks the horizontal display of checkbox group children.
      `}
    </SectionMessage>
  )}

  If you were previously using CheckboxGroup, you can replace your CheckboxGroup component with a simple flex wrapper, see the example below:

  ${(
    <Example
      packageName="@atlaskit/checkbox"
      Component={require('../examples/06-checkbox-groups').default}
      title="Checkbox Groups"
      source={require('!!raw-loader!../examples/06-checkbox-groups')}
    />
  )}

  ### CheckboxIcon:

  ${code`import { CheckboxIcon } from @atlaskit/checkbox;`}

  @atlaskit/checkbox now also exports a CheckboxIcon component, this is a functional wrapper around the @atlaskit/icon/glyph/checkbox svg,
  and is intended to be consumed in cases where a user wants a presentational checkbox inline with ADG3, without the Label and additional form markup.
  See the CheckboxSelect in @atlaskit/select for an example use case.


  ## Prop Changes
  ### Checkbox
  **initiallyChecked** renamed to **defaultChecked**
  **label** prop now accepts type Node instead of type string.
  **isChecked** is now an optional boolean prop on the Checkbox component.
`;
