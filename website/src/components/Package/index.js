// @flow
import * as React from 'react';
import styled from 'styled-components';
import { gridSize, colors, math } from '@atlaskit/theme';
import { Link } from 'react-router-dom';
import Page from './../Page';
import FourOhFour from './../FourOhFour';
import { getPackageByGroupAndName } from '../../utils/packages';
import { getList as getExampleList, formatLink, formatName } from '../../utils/examples';
import MetaData from './MetaData';

type PackageProps = {
  match: {
    params: {
      name: string,
      group: string,
    },
  },
};

type PackageState = {
  children?: React.Node,
};

export const Intro = styled.p`
  color: ${colors.heading};
  font-size: ${math.multiply(gridSize, 2)}px;
  font-weight: 300;
  line-height: 1.4em;
`;

export const Sep = styled.hr`
  border: none;
  border-top: 2px solid #EBECF0;
  margin-bottom: ${math.multiply(gridSize, 1.5)}px;
  margin-top: ${math.multiply(gridSize, 1.5)}px;

  @media (min-width: 780px) {
    margin-bottom: ${math.multiply(gridSize, 3)}px;
    margin-top: ${math.multiply(gridSize, 3)}px;
  }
`;

export const ExamplesList = (props) => {
  const { examples, name, group } = props;

  if (!examples || !examples.length) return null;

  return (
    <div>
      <Sep />
      <h2>Examples</h2>
      <ul>
        {examples.map(e => (
          <li key={e}>
            <Link to={`/packages/${group}/${name}/examples/${formatLink(e)}`}>{formatName(e)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const NoDocs = (props) => <div>Component "{props.name}" doesn't have any docs.</div>;

export default class Package extends React.Component<PackageProps, PackageState> {
  state = { children: null };
  props: PackageProps;

  async componentDidMount() {
    const { name, group } = this.props.match.params;
    this.loadDoc(name, group);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.name === this.props.match.params.name) {
      return;
    }
    const { name, group } = nextProps.match.params;
    this.loadDoc(name, group);
  }

  loadDoc(name, group) {
    const pkg = getPackageByGroupAndName(group, name);
    this.setState({ children: null }, () => {
      require.ensure([], (require) => {
        let children;
        try {
          children = require(`../../../../packages/${group}/${name}/docs/0-intro`).default;
          this.setState({ children });
        } catch (e) {
          this.setState({ children: <NoDocs name={pkg.name} /> });
        }
      });
    });
  }

  render() {
    const { children } = this.state;
    const { name, group } = this.props.match.params;
    const pkg = getPackageByGroupAndName(group, name);
    const examples = getExampleList(group, name);

    if (!pkg) {
      return <FourOhFour />;
    }

    return (
      <Page>
        <h1>{pkg.name}</h1>
        <Intro>{pkg.description}</Intro>
        <MetaData
          packageName={pkg.name}
          packageSrc={`https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/${pkg.relativePath}`}
        />
        <ExamplesList name={name} group={group} examples={examples} />
        <Sep />
        {children || <div>Loading...</div>}
      </Page>
    );
  }
}
