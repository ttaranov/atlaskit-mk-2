// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  ### Usage

  This component contains all the common behaviour and styles for fields

  ~~~js
  import FieldBase, {
    FieldBaseStateless,
    Label
  } from '@atlaskit/field-base';
  ~~~

  FieldBase provides an Atlassian Design Guidelines compatible implementation for:
  * Labels: spacing, margins, accessibility.
  * Fields: sizing, borders, colors, wrapping behaviour, hover/focus states.
  * Validation: styles (built in validation coming soon!)

  FieldBase components *will* work by themselves, but are really meant to be extended into a full field component.

  ${(
    <Example
      packageName="@atlaskit/field-base"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-base"
      Component={require('../examples/01-stateless-example').default}
      title="With Stateless FieldBase"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-base"
      Component={require('../examples/02-label-example').default}
      title="With Label"
      source={require('!!raw-loader!../examples/02-label-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/FieldBase')}
      heading="FieldBase Props"
    />
  )}

   ${(
     <Props
       props={require('!!extract-react-types-loader!../src/components/FieldBaseStateless')}
       heading="FieldBaseStateless Props"
     />
   )}

   ${(
     <Props
       props={require('!!extract-react-types-loader!../src/components/Label')}
       heading="Label Props"
     />
   )}

`;
