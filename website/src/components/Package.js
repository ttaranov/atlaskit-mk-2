// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import Page from './Page';
import FourOhFour from './FourOhFour';
import { getPackageByGroupAndName } from '../utils/packages';
import { filterExamplesByPackage, formatExampleLink, formatExampleName } from '../utils/examples';

type PackageProps = {
  match: {
    params: {
      group: string,
      name: string,
    },
  },
};

type PackageState = {
  children?: React.Node,
};

export default class Package extends React.PureComponent<PackageProps, PackageState> {
  state = { children: null };
  props: PackageProps;

  componentDidMount() {
    const { group, name } = this.props.match.params;
    require.ensure([], (require) => {
      this.setState({
        children: require(`../../../packages/${group}/${name}/docs/0-intro.js`).default,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.name === this.props.match.params.name) {
      return;
    }
    const { group, name } = nextProps.match.params;
    require.ensure([], (require) => {
      this.setState({
        children: require(`../../../packages/${group}/${name}/docs/0-intro.js`).default,
      });
    });
  }

  render() {
    const { children } = this.state;
    const { group, name } = this.props.match.params;
    const pkg = getPackageByGroupAndName(group, name);
    const examples = filterExamplesByPackage(name);

    if (!pkg) {
      return <FourOhFour />;
    }

    return (
      <Page>
        <h1>{pkg.name}</h1>
        <p>{pkg.description}</p>
        <h2>Examples</h2>
        <ul>
          {examples.map(e => (
            <li key={e}>
              <Link to={`/packages/${group}/${name}/examples/${formatExampleLink(e)}`}>{formatExampleName(e)}</Link>
            </li>
          ))}
        </ul>
        <hr />
        {children || <div>Loading...</div>}
      </Page>
    );
  }
}
