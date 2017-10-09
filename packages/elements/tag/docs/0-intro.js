// @flow
/* eslint-disable import/extensions, import/no-webpack-loader-syntax, global-require */
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  Tags are designed to be displayed within a [Tag Group](/components/tag-group).
  They can be rendered flat, as links, or with a close button.

  > **Note:** Once a tag has been removed, there is nothing that you can pass
  > to it to make it re-render the tag.

  ${<Example
    Component={require('../examples/0-basic').default}
    source={require('!!raw-loader!../examples/0-basic')}
  />}

  ${<Example
    Component={require('../examples/1-colors').default}
    source={require('!!raw-loader!../examples/1-colors')}
  />}
`;
