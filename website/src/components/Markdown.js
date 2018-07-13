// @flow

import React, { type Node } from 'react';
import CommonMark from 'commonmark';
import grayMatter from 'gray-matter';
import ReactRenderer from 'commonmark-react-renderer';
import { AkCodeBlock, AkCode } from '@atlaskit/code';
import { Helmet } from 'react-helmet';
import Heading from './Markdown/Heading';

type Props = {
  literal: string,
  language: string,
};

const parser = new CommonMark.Parser();
const renderer = new ReactRenderer({
  renderers: {
    CodeBlock: (props: Props) => (
      <p>
        <AkCodeBlock text={props.literal} language={props.language} />
      </p>
    ),
    Code: (props: Props) => (
      <AkCode text={props.literal} language={props.language} />
    ),
    Heading,
  },
});

export default function Markdown({ children }: { children: Node }) {
  const { data: markdownMetaData, content: markdownContent } = grayMatter(
    children,
  );
  return (
    <div>
      <Helmet>
        <title>
          {markdownMetaData.title} - {BASE_TITLE}
        </title>
      </Helmet>
      {renderer.render(parser.parse(markdownContent))}
    </div>
  );
}
