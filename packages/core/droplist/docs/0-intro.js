// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Usage

  An internal base component for implementing dropdown and select components.

${code`
import DropList, {
  DroplistGroup,
  Item
} from '@atlaskit/droplist';
`}

  This is a base component on which such components as @atlaskit/dropdown-menu,
  @atlaskit/single-select, @atlaskit/multi-select are built. It contains only styles and
  very basic logic. It does not have any keyboard interactions, selectable logic or
  open/close functionality


  ${(
    <Example
      packageName="@atlaskit/droplist"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/droplist"
      Component={require('../examples/01-bound-example').default}
      title="With Label"
      source={require('!!raw-loader!../examples/01-bound-example')}
    />
  )}

   ${(
     <Props
       props={require('!!extract-react-types-loader!../src/components/Droplist')}
       heading="Droplist Props"
     />
   )}

   ${(
     <Props
       props={require('!!extract-react-types-loader!../src/components/Group')}
       heading="Group Props"
     />
   )}

   ${(
     <Props
       props={require('!!extract-react-types-loader!../src/components/Element')}
       heading="Element Props"
     />
   )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Item')}
      heading="Item Props"
    />
  )}
`;
