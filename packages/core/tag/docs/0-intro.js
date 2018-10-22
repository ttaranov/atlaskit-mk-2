// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Tags are designed to be displayed within a [Tag Group](/components/tag-group).
  They can be rendered flat, as links, or with a close button.

  > **Note:** Once a tag has been removed, there is nothing that you can pass
  > to it to make it re-render the tag.

  ## Examples

  ${(
    <Example
      packageName="@atlaskit/tag"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/tag"
      Component={require('../examples/1-colors').default}
      title="Colors"
      source={require('!!raw-loader!../examples/1-colors')}
    />
  )}

  ${<Props props={require('!!extract-react-types-loader!../src/Tag')} />}
`;
