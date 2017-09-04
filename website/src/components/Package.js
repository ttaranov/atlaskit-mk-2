// @flow
import * as React from 'react';
import Page from './Page';
import FourOhFour from './FourOhFour';
import { getExamplesForUnscopedPackage, getPackageByUnscopedName } from '../utils/packages';

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
    const name = this.props.match.params.name;
    const pkg = getPackageByUnscopedName(name);
    const examples = getExamplesForUnscopedPackage(name);

    if (!pkg) {
      return <FourOhFour />;
    }

    return (
      <Page>
        <h1>{pkg.name}</h1>
        <p>{pkg.description}</p>
        <h2>Examples</h2>
        <ul>{examples.map(e => <li key={e}>{e}</li>)}</ul>
        <hr />
        {!this.state.children ? <div>Loading...</div> : this.state.children}
      </Page>
    );
  }
}
