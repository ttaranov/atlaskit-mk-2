/* @flow */
import React, { Component, type Node } from 'react';
import { Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import type { Directory, RouterMatch } from '../types';
import { packages } from '../site';
import * as fs from '../utils/fs';
import Page, { Title } from '../components/Page';
import FourOhFour from './FourOhFour';
import Loading from '../components/Loading';

type PackageDocumentProps = {
  match: RouterMatch,
};

export default function PackageDocument({
  match: { params: { groupId, pkgId, docId } },
}: PackageDocumentProps) {
  const filePath = `packages/${groupId}/${pkgId}/docs/${docId}`;
  const found = fs.findNormalized(packages, filePath);

  if (!found) {
    return <FourOhFour />;
  }

  const Content = Loadable({
    loading: Loading,
    loader: () => found && found.exports(),
    render: doc => (doc ? doc.default : <FourOhFour />),
  });

  return (
    <Page>
      <Title>
        {fs.titleize(pkgId)} – {fs.titleize(docId)}
      </Title>
      <Content />
    </Page>
  );
}
