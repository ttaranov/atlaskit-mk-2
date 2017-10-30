/* @flow */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import type { Directory, File, RouterMatch } from '../types';
import * as fs from '../utils/fs';
import Page from '../components/Page';
import Markdown from '../components/Markdown';
import FourOhFour from './FourOhFour';
import Loading from '../components/Loading';
import Loadable from 'react-loadable';
import { docs } from '../site';

type DocProps = {
  match: RouterMatch,
};

export default function Document({ match: { params: { docId } } }: DocProps) {
  if (!docId) {
    const found = fs.getFiles(docs.children)[0];
    if (!found) return <FourOhFour />;
    return <Redirect to={`/docs/${fs.normalize(found.id)}`} />;
  }

  const filePath = `docs/${docId}`;
  const found = fs.findNormalized(docs, filePath);

  const Content = Loadable({
    loader: () => found && found.exports(),
    loading: Loading,
    render(md) {
      if (md) {
        return <Markdown>{md}</Markdown>;
      } else {
        return <FourOhFour />;
      }
    },
  });

  return (
    <Page>
      <Content />
    </Page>
  );
}
