/* @flow */
import React, { Component } from 'react';
import CommonMark from 'commonmark';
import ReactRenderer from 'commonmark-react-renderer';
import type { Directory } from '../types';
import * as fs from '../utils/fs';
import Page from '../components/Page';
import FourOhFour from './FourOhFour';
import Loading from '../components/Loading';
import Loadable from 'react-loadable';

const parser = new CommonMark.Parser();
const renderer = new ReactRenderer();

type DocProps = {
  docs: Directory,
  docId: string,
};

export default function Document(props: DocProps) {
  const filePath = `docs/${props.docId}`;
  const found = fs.findNormalized(props.docs, filePath);

  const Content = Loadable({
    loader: () => found && found.exports(),
    loading: Loading,
    render(md) {
      if (md) {
        return <div>{renderer.render(parser.parse(md))}</div>;
      } else {
        return <FourOhFour/>;
      }
    }
  });

  return (
    <Page>
      <Content/>
    </Page>
  );
}
