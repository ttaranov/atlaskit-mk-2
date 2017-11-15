// @flow

import React, { type Node } from 'react';
import styled from 'styled-components';
import { gridSize, colors, math } from '@atlaskit/theme';
import { Link } from 'react-router-dom';
import LinkButton from '../../components/LinkButton';
import Page from '../../components/Page';
import FourOhFour from '../FourOhFour';
import { isModuleNotFoundError } from '../../utils/errors';
import MetaData from './MetaData';
import type { Directory, RouterMatch } from '../../types';
import * as fs from '../../utils/fs';
import { packageExampleUrl } from '../../utils/url';
import { packages } from '../../site';
import type { Logs } from '../../components/ChangeLog';
import LatestChangelog from './LatestChangelog';
import { divvyChangelog } from '../../utils/changelog';

export const Title = styled.div`
  display: flex;

  h1 {
    flex-grow: 1;
  }
`;

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

type NoDocsProps = {
  name: string,
};

export const NoDocs = (props: NoDocsProps) => {
  return <div>Component "{props.name}" doesn't have any docs.</div>;
};

type PackageProps = {
  match: RouterMatch,
};

type PackageState = {
  pkg: Object | null,
  doc: Node | null,
  missing: boolean | null,
  changelog: Logs,
};

function getPkg(packages, groupId, pkgId) {
  let groups = fs.getDirectories(packages.children);
  let group = fs.getById(groups, groupId);
  let pkgs = fs.getDirectories(group.children);
  let pkg = fs.getById(pkgs, pkgId);
  return pkg;
}

export default class Package extends React.Component<
  PackageProps,
  PackageState,
> {
  state = { pkg: null, doc: null, missing: false, changelog: [] };
  props: PackageProps;

  componentDidMount() {
    this.loadDoc();
  }

  componentWillReceiveProps({
    match: { params: { groupId, pkgId } },
  }: PackageProps) {
    if (
      groupId === this.props.match.params.groupId &&
      pkgId === this.props.match.params.pkgId
    ) {
      return;
    }

    this.loadDoc();
  }

  loadDoc() {
    this.setState(
      { pkg: null, doc: null, changelog: [], missing: false },
      () => {
        let { groupId, pkgId } = this.props.match.params;
        let pkg = getPkg(packages, groupId, pkgId);
        let dirs = fs.getDirectories(pkg.children);
        let files = fs.getFiles(pkg.children);

        let json = fs.getById(files, 'package.json');
        let changelog = fs.maybeGetById(files, 'CHANGELOG.md');
        let docs = fs.maybeGetById(dirs, 'docs');
        // let examples = fs.maybeGetById(dirs, 'examples');

        let doc;
        if (docs) {
          doc = fs.find(docs, () => {
            return true;
          });
        }

        Promise.all([
          json.exports(),
          doc && doc.exports().then(mod => mod.default),
          changelog &&
            changelog.contents().then(changelog => divvyChangelog(changelog)),
        ])
          .then(([pkg, doc, changelog]) => {
            this.setState({ pkg, doc, changelog: changelog || [] });
          })
          .catch(err => {
            if (isModuleNotFoundError(err)) {
              this.setState({ missing: true });
            } else {
              throw err;
            }
          });
      },
    );
  }

  render() {
    const { groupId, pkgId } = this.props.match.params;
    const { pkg, doc, changelog, missing } = this.state;

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
        <Title>
          <h1>{fs.titleize(pkgId)}</h1>
          <LinkButton to={packageExampleUrl(groupId, pkgId)}>
            Examples
          </LinkButton>
        </Title>
        <Intro>{pkg.description}</Intro>
        <MetaData
          packageName={pkg.name}
          packageSrc={`https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/${
            groupId
          }/${pkgId}`}
        />
        <LatestChangelog
          changelog={changelog}
          pkgId={pkgId}
          groupId={groupId}
        />
        <Sep />
        {doc || <NoDocs name={pkgId} />}
      </Page>
    );
  }
}
