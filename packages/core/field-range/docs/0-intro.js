// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  ### Usage

  Component which renders a slider and is a substitute of the native input[range] element

  ${code`import FieldRange from '@atlaskit/field-range';`}

  The onChange prop provides a way to subscribe to changes in the value.

  ${(
    <Example
      packageName="@atlaskit/field-range"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FieldRange')}
      heading="FieldRange Props"
    />
  )}

`;
