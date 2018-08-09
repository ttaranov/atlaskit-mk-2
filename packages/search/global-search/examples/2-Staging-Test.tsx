import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import { Config } from '../src/api/configureSearchClients';
import withNavigation from '../example-helpers/withNavigation';

const GlobalQuickSearchInNavigation = withNavigation(GlobalQuickSearch);
const config: Partial<Config> = {
  activityServiceUrl: 'https://api-private.stg.atlassian.com/activity',
  searchAggregatorServiceUrl:
    'https://api-private.stg.atlassian.com/xpsearch-aggregator',
  directoryServiceUrl: 'https://api-private.stg.atlassian.com/directory',
};

export default class extends React.Component<{}, { cloudId: string }> {
  state = {
    cloudId: 'DUMMY-7c8a2b74-595a-41c7-960c-fd32f8572cea', // SDOG
  };

  handleInputChange = e => {
    this.setState({
      cloudId: e.target.value,
    });
  };

  render() {
    return (
      <div>
        Cloud Id:{' '}
        <input
          type="text"
          value={this.state.cloudId}
          onChange={this.handleInputChange}
        />
        <br />
        <GlobalQuickSearchInNavigation
          cloudId={this.state.cloudId}
          {...config}
        />
      </div>
    );
  }
}
