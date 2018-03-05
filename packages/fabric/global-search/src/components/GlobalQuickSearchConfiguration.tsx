import * as React from 'react';
import GlobalQuickSearchContainer from './GlobalQuickSearchContainer';
import configureSearchClients from '../api/configureSearchClients';
import memoizeOne from 'memoize-one';

const memoizeOneTyped: <T extends Function>(func: T) => T = memoizeOne;

export interface Props {
  cloudId: string;
  environment: 'local' | 'development' | 'staging' | 'production';
}

/**
 * Component that exposes the public API for global quick search. Its only purpose is to offer a simple, user-friendly API to the outside and hide the implementation detail of search clients etc.
 */
export default class GlobalQuickSearchConfiguration extends React.Component<
  Props
> {
  // configureSearchClients is a potentially expensive function that we don't want to invoke on re-renders
  memoizedConfigureSearchClients = memoizeOneTyped(configureSearchClients);

  render() {
    const searchClients = this.memoizedConfigureSearchClients(
      this.props.cloudId,
      this.props.environment,
    );

    return <GlobalQuickSearchContainer {...searchClients} />;
  }
}
