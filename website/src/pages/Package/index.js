// @flow

import React, { type Node } from 'react';
import styled from 'styled-components';
import { gridSize, colors, math } from '@atlaskit/theme';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import FourOhFour from '../FourOhFour';
import { getPackageByGroupAndName } from '../../utils/packages';
import { getList } from '../../utils/examples';
import MetaData from './MetaData';
import { join } from '../../utils/path';

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
  name: string,
  group: string,
  match: {
    params: {
      name: string,
      group: string,
    },
  },
};

type PackageState = {
  children?: Node,
};

export default class Package extends React.Component<PackageProps, PackageState> {
  state = { children: null };
  props: PackageProps;

  componentDidMount() {
    const { name, group } = this.props.match.params;
    this.loadDoc(name, group);
  }

  componentWillReceiveProps(nextProps: PackageProps) {
    if (nextProps.match.params.name === this.props.match.params.name) {
      return;
    }
    const { name, group } = nextProps.match.params;
    this.loadDoc(name, group);
  }

  loadDoc(name: string, group: string) {
    const pkg = getPackageByGroupAndName(group, name);
    if (!pkg) return;

    this.setState({ children: null }, () => {
      // $FlowFixMe
      import(`../../../../packages/${group}/${name}/docs/0-intro`)
        .then((children: { default: Node }) => this.setState({ children: children.default }))
        .catch(() => this.setState({ children: <NoDocs name={pkg.name} /> }));
    });
  }

  render() {
    const { children } = this.state;
    const { name, group } = this.props.match.params;
    const pkg = getPackageByGroupAndName(group, name);
    const examples = getList(join(group, name));

    if (!pkg) {
      return <FourOhFour />;
    }

    return (
      <Page>
        <h1>{pkg.name}</h1>
        <Intro>{pkg.description}</Intro>
        <MetaData packageName={pkg.name} packageSrc={`https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/${pkg.relativePath}`} />
        <ExamplesList name={name} group={group} examples={examples} />
        <Sep />
        {children || <div>Loading...</div>}
      </Page>
    );
  }
}
