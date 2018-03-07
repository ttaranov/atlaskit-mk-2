import * as React from 'react';
import GlobalQuickSearchContainer from './GlobalQuickSearchContainer';
import configureSearchClients, { Config } from '../api/configureSearchClients';
import memoizeOne from 'memoize-one';

const memoizeOneTyped: <T extends Function>(func: T) => T = memoizeOne;

export interface Props {
  /**
   * The cloudId of the site the component is embedded in.
   */
  cloudId: string;

  /**
   * For development purposes only: Overrides the URL to the activity service.
   */
  activityServiceUrl?: string;

  /**
   * For development purposes only: Overrides the URL to the search aggregator service.
   */
  searchAggregatorServiceUrl?: string;

  /**
   * For development purposes only: Overrides the URL to the directory service.
   */
  directoryServiceUrl?: string;
}

/**
 * Component that exposes the public API for global quick search. Its only purpose is to offer a simple, user-friendly API to the outside and hide the implementation detail of search clients etc.
 */
export default class GlobalQuickSearchConfiguration extends React.Component<
  Props
> {
  // configureSearchClients is a potentially expensive function that we don't want to invoke on re-renders
  memoizedConfigureSearchClients = memoizeOneTyped(configureSearchClients);

  private makeConfig() {
    const config: Partial<Config> = {};
    const {
      activityServiceUrl,
      searchAggregatorServiceUrl,
      directoryServiceUrl,
    } = this.props;

    if (activityServiceUrl) {
      config.activityServiceUrl = activityServiceUrl;
    }

    if (searchAggregatorServiceUrl) {
      config.searchAggregatorServiceUrl = searchAggregatorServiceUrl;
    }
    if (directoryServiceUrl) {
      config.directoryServiceUrl = directoryServiceUrl;
    }

    return config;
  }

  render() {
    const searchClients = this.memoizedConfigureSearchClients(
      this.props.cloudId,
      this.makeConfig(),
    );

    return <GlobalQuickSearchContainer {...searchClients} />;
  }
}
