// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  Use me like you love me.

  ${<Example
    Component={require('../examples/wysiwyg').default}
    source={require('!!raw-loader!../examples/wysiwyg')}
    title="WYSIWYG"
  />}
`;
