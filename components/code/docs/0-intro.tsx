import * as React from 'react';
import { md, Example } from '@atlaskit/docs';
import InlineCodeBasic from '../examples/00-inline-code-basic';

export default md`
  Renders inline code snippets and code blocks.

  ## Inline Code

  ${<Example component={<InlineCodeBasic />}/>}

`;
