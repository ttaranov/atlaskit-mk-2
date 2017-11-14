/* @flow */

import React, { type Node } from 'react';
import CommonMark from 'commonmark';
import ReactRenderer from 'commonmark-react-renderer';
import { AkCodeBlock, AkCode } from '@atlaskit/code';

const parser = new CommonMark.Parser();
const renderer = new ReactRenderer({
  renderers: {
    CodeBlock: props => (
      <p>
        <AkCodeBlock text={props.literal} language={props.language} />
      </p>
    ),
    Code: props => <AkCode text={props.literal} language={props.language} />,
  },
});

export default function Markdown({ children }: { children: Node }) {
  return <div>{renderer.render(parser.parse(children))}</div>;
}
