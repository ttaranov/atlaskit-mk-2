/* @flow */
import * as React from 'react';
import CommonMark from 'commonmark';
import ReactRenderer from 'commonmark-react-renderer';
import getDocs from '../utils/docs';
import Page from '../components/Page';
import FourOhFour from './FourOhFour';

const parser = new CommonMark.Parser();
const renderer = new ReactRenderer();

type DocProps = {
  match: {
    params: {
      name: string,
      group: string
    }
  }
};

export default function Doc(props: DocProps) {
  const { group, name } = props.match.params;
  const docs = getDocs();
  const docPath = name ? `${group}/${name}.md` : `${group}.md`;
  const content = (docs.find(d => d.filePath.match(docPath)) || {}).fileContents;
  if (!content) return <FourOhFour />;
  const ast = parser.parse(content);
  return <Page>{renderer.render(ast)}</Page>;
}
