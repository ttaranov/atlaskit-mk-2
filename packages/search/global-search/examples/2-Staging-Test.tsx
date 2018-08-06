import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { Config } from '../src/api/configureSearchClients';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

const config: Partial<Config> = {
  activityServiceUrl: 'https://api-private.stg.atlassian.com/activity',
  searchAggregatorServiceUrl:
    'https://api-private.stg.atlassian.com/xpsearch-aggregator',
  directoryServiceUrl: 'https://api-private.stg.atlassian.com/directory',
};

export default class extends React.Component<
  {},
  { cloudId: string; context: 'home' | 'confluence' }
> {
  constructor(props) {
    super(props);
    this.state = {
      cloudId: 'DUMMY-7c8a2b74-595a-41c7-960c-fd32f8572cea', // SDOG
      context: 'home',
    };
  }

  handleInputChange = e => {
    this.setState({
      cloudId: e.target.value,
    });
  };

  handleRadioChange = e => {
    this.setState({
      context: e.target.value,
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
        Context:
        <input
          type="radio"
          id="contextHome"
          name="context"
          value="home"
          onChange={this.handleRadioChange}
        />
        <label for="contextHome">Home</label>
        <input
          type="radio"
          id="contextConf"
          name="context"
          value="confluence"
          onChange={this.handleRadioChange}
        />
        <label for="contextConf">Confluence</label>
        <BasicNavigation
          searchDrawerContent={
            <LocaleIntlProvider>
              <GlobalQuickSearch
                cloudId={this.state.cloudId}
                context={this.state.context}
                {...config}
              />
            </LocaleIntlProvider>
          }
        />
      </div>
    );
  }
}
