// @flow
import React from 'react';
import styled from 'styled-components';
import stringRaw from 'string-raw';
import { AkCodeBlock } from '@atlaskit/code';

/*
 * Tag function to render a code block, e.g. code`console.log("hello world")`
 * Template expressions aren't yet supported, and likely never will be.
 */
export default function code(
  // Tagged Template Literal support is still WIP for flow: https://github.com/facebook/flow/issues/2616
  sources: any,
  ...substitutions: any[]
) {
  let source = stringRaw(sources, substitutions);
  source = source.replace(/^(\s*\n)+/g, ''); // Remove leading newlines
  source = source.replace(/(\n\s*)+$/g, ''); // Remove trailing newlines
  return (
    <CodeWrapper>
      <AkCodeBlock language="javascript" text={source} />
    </CodeWrapper>
  );
}

const CodeWrapper = styled.div`
  margin-top: 8px;
`;
