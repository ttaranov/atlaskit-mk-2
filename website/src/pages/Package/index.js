// @flow

import React, { Component, type Node } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { gridSize, colors, math } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import ExamplesIcon from '@atlaskit/icon/glyph/screen';
import { AtlassianIcon } from '@atlaskit/logo';

import Loading from '../../components/Loading';
import Page from '../../components/Page';
import FourOhFour from '../FourOhFour';

import MetaData from './MetaData';
import LatestChangelog from './LatestChangelog';

import { divvyChangelog } from '../../utils/changelog';
import { isModuleNotFoundError } from '../../utils/errors';
import * as fs from '../../utils/fs';
import type { RouterMatch } from '../../types';

import { packages } from '../../site';
import type { Logs } from '../../components/ChangeLog';

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
export const ButtonGroup = styled.div`
  display: inline-flex;
  margin: 0 -2px;

  > * {
    flex: 1 0 auto;
    margin: 0 2px !important;
  }
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
  changelog: Logs,
  doc: Node | null,
  examples: Array<any> | null,
  missing: boolean | null,
  pkg: Object | null,
};

function getPkg(packages, groupId, pkgId) {
  const groups = fs.getDirectories(packages.children);
  const group = fs.getById(groups, groupId);
  const pkgs = fs.getDirectories(group.children);
  const pkg = fs.getById(pkgs, pkgId);
  return pkg;
}

const initialState = {
  changelog: [],
  doc: null,
  examples: null,
  missing: false,
  pkg: null,
};

export default class Package extends Component<PackageProps, PackageState> {
  state = initialState;
  props: PackageProps;

  componentDidMount() {
    this.loadDoc();
  }

  componentWillReceiveProps({
    match: {
      params: { groupId, pkgId },
    },
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
    this.setState(initialState, () => {
      const { groupId, pkgId } = this.props.match.params;
      try {
        const pkg = getPkg(packages, groupId, pkgId);
        const dirs = fs.getDirectories(pkg.children);
        const files = fs.getFiles(pkg.children);

        const json = fs.getById(files, 'package.json');
        const changelog = fs.maybeGetById(files, 'CHANGELOG.md');
        const docs = fs.maybeGetById(dirs, 'docs');
        const examples = fs.maybeGetById(dirs, 'examples');

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
            this.setState({
              pkg,
              doc,
              examples: examples && examples.children,
              changelog: changelog || [],
            });
          })
          .catch(err => {
            if (isModuleNotFoundError(err, pkgId)) {
              this.setState({ missing: true });
            } else {
              throw err;
            }
          });
      } catch (err) {
        if (isModuleNotFoundError(err, pkgId)) {
          this.setState({ missing: true });
        } else {
          throw err;
        }
      }
    });
  }

  getExamplesPath = (inModal?: boolean) => {
    const { groupId, pkgId } = this.props.match.params;
    const { examples } = this.state;

    if (!examples || !examples.length) return null;

    const regex = /^[a-zA-Z0-9]/; // begins with letter or number, avoid "special" files
    const filtered = examples.map(a => a.id).filter(id => id.match(regex));
    const res = filtered[0];

    if (!res) return null;

    return inModal
      ? `/packages/${groupId}/${pkgId}/example/${fs.normalize(res)}`
      : `/examples/${groupId}/${pkgId}/${fs.normalize(res)}`;
  };

  render() {
    const { isExact: urlIsExactMatch } = this.props.match;
    const { groupId, pkgId } = this.props.match.params;
    const { pkg, doc, changelog, missing } = this.state;

    if (missing) {
      return <FourOhFour />;
    }

    if (!pkg) {
      return (
        <Page>
          <Loading />
        </Page>
      );
    }

    const examplePath = this.getExamplesPath();
    const exampleModalPath = this.getExamplesPath(true);

    return (
      <Page>
        {urlIsExactMatch && (
          <Helmet>
            <title>
              {fs.titleize(pkgId)} package - {BASE_TITLE}
            </title>
          </Helmet>
        )}
        <Title>
          <h1>{fs.titleize(pkgId)}</h1>
          {examplePath && (
            <ButtonGroup>
              <Button
                component={Link}
                iconBefore={<ExamplesIcon label="Examples Icon" />}
                to={examplePath}
              />
              <Button component={Link} to={exampleModalPath}>
                Examples
              </Button>
              {pkg['atlaskit:designLink'] && (
                <Button
                  iconBefore={<AtlassianIcon />}
                  href={pkg['atlaskit:designLink']}
                >
                  Design docs
                </Button>
              )}
            </ButtonGroup>
          )}
        </Title>
        <Intro>{pkg.description}</Intro>
        <MetaData
          packageName={pkg.name}
          packageSrc={`https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/${groupId}/${pkgId}`}
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
