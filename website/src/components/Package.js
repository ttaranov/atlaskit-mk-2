// @flow
import * as React from 'react';
import Page from './Page';
import FourOhFour from './FourOhFour';
import { getPackageByUnscopedName } from '../utils/packages';

type PackageProps = {
  match: {
    params: {
      name: string,
    },
  },
};

export default class Package extends React.PureComponent<PackageProps> {
  props: PackageProps;

  render() {
    const name = this.props.match.params.name;
    const pkg = getPackageByUnscopedName(name);

    if (!pkg) {
      return <FourOhFour />;
    }

    return (
      <Page>
        <h1>{pkg.name}</h1>
      </Page>
    );
  }
}
