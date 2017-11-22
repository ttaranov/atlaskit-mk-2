// @flow
import React from 'react';
import { AkCodeBlock } from '@atlaskit/code';

/*
 * Tag function to render a code block, e.g. code`console.log("hello world")`
 * Template expressions aren't yet supported, and likely never will be.
 */
export default function code(sources:  string[]) {
  return (
    <div>
      {sources
        .map(source => source.replace(/^(\s*\n)+/g, '')) // Remove leading newlines
        .map(source => <AkCodeBlock language="javascript" text={source} />)}
    </div>
  );
};
