// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This is a generic Item component, designed to be composed declaratively into other components.
  Item is generally a layout component, concerned with visual presentation of the content provided via props.

  ## Examples

  ${(
    <Example
      packageName="@atlaskit/item"
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}


  ${(
    <Props
      heading="Item Props"
      props={require('!!extract-react-types-loader!../src/components/Item')}
    />
  )}

  ${(
    <Props
      heading="ItemGroup Props"
      props={require('!!extract-react-types-loader!../src/components/ItemGroup')}
    />
  )}

  ${(
    <Props
      heading="withItemClick Props"
      props={require('!!extract-react-types-loader!../src/components/ItemGroup')}
    />
  )}

  ${(
    <Props
      heading="withItemFocus Props"
      props={require('!!extract-react-types-loader!../src/components/ItemGroup')}
    />
  )}

`;
