import * as React from 'react';
import path from 'path';
import { md, TypeScriptExample, TypeScriptProps } from '@atlaskit/docs';

export default md`
  Renders inline code snippets and code blocks.

  ## Inline Code

  ${<TypeScriptExample src={path.join(__dirname, '../examples/0-inline-code-basic.tsx')}/>}
  ${<TypeScriptProps src={path.join(__dirname, '../src/components/Code.tsx')}/>}

  ## Code Block

  ${<TypeScriptExample src={path.join(__dirname, '../examples/0-code-block-basic.tsx')}/>}
  ${<TypeScriptProps src={path.join(__dirname, '../src/components/CodeBlock.tsx')}/>}
`;
