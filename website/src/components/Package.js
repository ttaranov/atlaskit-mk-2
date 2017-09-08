// @flow
import * as React from 'react';
import Page from './Page';
import FourOhFour from './FourOhFour';
import { Link } from 'react-router-dom';
import { getPackageByUnscopedName } from '../utils/packages';
import { filterExamplesByPackage, formatExampleLink, formatExampleName } from '../utils/examples';

type PackageProps = {
  match: {
    params: {
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
    require.ensure(['../../../components/tag-group/docs/0-intro.js'], () => {
      this.setState({
        children: require('../../../components/tag-group/docs/0-intro.js').default,
      });
    });
  }

  render() {
    const { children } = this.state;
    const name = this.props.match.params.name;
    const pkg = getPackageByUnscopedName(name);
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
              <Link to={`/packages/${name}/examples/${formatExampleLink(e)}`}>{formatExampleName(e)}</Link>
            </li>
          ))}
        </ul>
        <hr />
        {children || <div>Loading...</div>}
      </Page>
    );
  }
}
