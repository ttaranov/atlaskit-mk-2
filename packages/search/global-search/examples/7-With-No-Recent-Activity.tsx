import * as React from 'react';
import { GlobalQuickSearch } from '../src';
import withNavigation from '../example-helpers/withNavigation';

const GlobalQuickSearchInNavigation = withNavigation(GlobalQuickSearch);

export default class extends React.Component {
  render() {
    return <GlobalQuickSearchInNavigation />;
  }
}
