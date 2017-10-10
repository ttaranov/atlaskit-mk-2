// @flow

import React, { type Node } from 'react';
import styled from 'styled-components';
import { gridSize, colors, math } from '@atlaskit/theme';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import FourOhFour from '../FourOhFour';
import { isModuleNotFoundError } from '../../utils/errors';
import MetaData from './MetaData';
// import { join } from '../../utils/path';
import type { Directory } from '../../types';
import * as fs from '../../utils/fs';

export const Intro = styled.p`
  color: ${colors.heading};
  font-size: ${math.multiply(gridSize, 2)}px;
  font-weight: 300;
  line-height: 1.4em;
`;

export const Sep = styled.hr`
  border: none;
  border-top: 2px solid #ebecf0;
  margin-bottom: ${math.multiply(gridSize, 1.5)}px;
  margin-top: ${math.multiply(gridSize, 1.5)}px;

  @media (min-width: 780px) {
    margin-bottom: ${math.multiply(gridSize, 3)}px;
    margin-top: ${math.multiply(gridSize, 3)}px;
  }
`;

type ExamplesListProps = {
  examples: Array<{ name: string, link: string }>,
  group: string,
  name: string,
};

export const ExamplesList = (props: ExamplesListProps) => {
  const { examples, name, group } = props;

  if (!examples || !examples.length) return null;

  return (
    <div>
      <Sep />
      <h2>Examples</h2>
      <ul>
        {examples.map(example => (
          <li key={example.name}>
            <Link to={`/packages/${group}/${name}/examples/${example.link}`}>{example.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

type NoDocsProps = {
  name: string,
};

export const NoDocs = (props: NoDocsProps) => {
  return (
    <div>Component "{props.name}" doesn't have any docs.</div>
  );
};

type PackageProps = {
  packages: Directory,
  groupId: string,
  pkgId: string,
};

type PackageState = {
  pkg: Object | null,
  doc: Node | null,
  missing: boolean | null,
};

function getPkg(packages, groupId, pkgId) {
  let groups = fs.getDirectories(packages.children);
  let group = fs.getById(groups, groupId);
  let pkgs = fs.getDirectories(group.children);
  let pkg = fs.getById(pkgs, pkgId);
  return pkg;
}

export default class Package extends React.Component<PackageProps, PackageState> {
  state = { pkg: null, doc: null, missing: false };
  props: PackageProps;

  componentDidMount() {
    this.loadDoc();
  }

  componentWillReceiveProps(nextProps: PackageProps) {
    if (
      nextProps.groupId === this.props.groupId &&
      nextProps.pkgId === this.props.pkgId
    ) {
      return;
    }

    this.loadDoc();
  }

  loadDoc() {
    this.setState({ pkg: null, doc: null, missing: false }, () => {
      let pkg = getPkg(this.props.packages, this.props.groupId, this.props.pkgId);
      let dirs = fs.getDirectories(pkg.children);
      let files = fs.getFiles(pkg.children);

      let json = fs.getById(files, 'package.json');
      let docs = fs.getById(dirs, 'docs');
      let examples = fs.getById(dirs, 'examples');

      let doc = fs.find(docs, () => {
        return true;
      });

      Promise.all([
        json.exports(),
        doc && doc.exports().then(mod => mod.default),
      ]).then(([pkg, doc]) => {
        this.setState({ pkg, doc });
      }).catch(err => {
        if (isModuleNotFoundError(err)) {
          this.setState({ missing: true })
        } else {
          throw err;
        }
      });
    });
  }

  render() {
    const { groupId, pkgId } = this.props;
    const { pkg, doc, missing } = this.state;

    if (missing) {
      return <FourOhFour />;
    }

    if (!pkg) {
      return (
        <Page>
          <div>Loading...</div>
        </Page>
      );
    }

    return (
      <Page>
        <h1>{pkg.name}</h1>
        <Intro>{pkg.description}</Intro>
        <MetaData packageName={pkg.name} packageSrc={`https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/${groupId}/${pkgId}`} />
        <Sep />
        {doc || <NoDocs name={pkgId} />}
      </Page>
    );
  }
}
