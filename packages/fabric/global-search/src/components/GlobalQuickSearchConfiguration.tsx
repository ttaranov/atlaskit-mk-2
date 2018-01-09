import * as React from 'react';
import GlobalQuickSearchContainer from './GlobalQuickSearchContainer';
import configureSearchProviders from '../api/configureSearchProviders';
import memoizeOne from 'memoize-one';

const memoizeOneTyped: <T extends Function>(func: T) => T = memoizeOne;

export interface Props {
  cloudId: string;
  environment: 'local' | 'development' | 'staging' | 'production';
}

/**
 * Component that exposes the public API for global quick search.
 */
export default class GlobalQuickSearchConfiguration extends React.Component<
  Props
> {
  // configureSearchProviders is a potentially expensive function that we don't want to invoke on re-renders
  memoizedConfigureSearchProviders = memoizeOneTyped(configureSearchProviders);

  render() {
    const searchProviders = this.memoizedConfigureSearchProviders(
      this.props.cloudId,
      this.props.environment,
    );

    return <GlobalQuickSearchContainer {...searchProviders} />;
  }
}
