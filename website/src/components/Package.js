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

  async componentDidMount() {
    const { name } = this.props.match.params;
    require.ensure([], (require) => {
      this.setState({
        children: require(`../../../components/${name}/docs/0-intro.js`).default,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.name === this.props.match.params.name) {
      return;
    }
    const { name } = nextProps.match.params;
    require.ensure([], (require) => {
      this.setState({
        children: require(`../../../components/${name}/docs/0-intro.js`).default,
      });
    });
  }

  render() {
    const name = this.props.match.params.name;
    const pkg = getPackageByUnscopedName(name);
    // const examples = getExamplesForUnscopedPackage(name);

    // console.log(examples);

    if (!pkg) {
      return <FourOhFour />;
    }

    return (
      <Page>
        <h1>{pkg.name}</h1>
        {!this.state.children ? <div>Loading...</div> : this.state.children}
      </Page>
    );
  }
}
