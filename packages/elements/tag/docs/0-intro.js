// @flow
import * as React from 'react';
import path from 'path';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Tags are designed to be displayed within a [Tag Group](/components/tag-group).
  They can be rendered flat, as links, or with a close button.

  > **Note:** Once a tag has been removed, there is nothing that you can pass
  > to it to make it re-render the tag.

  ${<Example source={require('!!raw-loader!../examples/0-basic')} />}

  ${<Example source={require('!!raw-loader!../examples/1-colors')} />}

  ${<Props source={require('!!raw-loader!../src/components/Tag')} />}
`;
