// @flow
import * as React from 'react';
import path from 'path';
import { md, Example, Props } from 'website-display-thingy';

export default md`
  Tags are designed to be displayed within a [Tag Group](/components/tag-group).
  They can be rendered flat, as links, or with a close button.

  > **Note:** Once a tag has been removed, there is nothing that you can pass
  > to it to make it re-render the tag.

  ${<Example src={path.join(__dirname, '../examples/0-basic.js')}/>}
  ${<Example src={path.join(__dirname, '../examples/1-colors.js')}/>}
  ${<Props src={path.join(__dirname, '../src/components/Tag.js')}/>}
`;
