// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Size Detector is a utility component that informs the child function of the available width and height.

  ## Examples

  ${(
    <Example
      packageName="@atlaskit/size-detector"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/SizeDetector')}
    />
  )}
`;
