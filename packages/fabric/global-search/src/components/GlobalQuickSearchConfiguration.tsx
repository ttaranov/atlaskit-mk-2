import * as React from 'react';
import GlobalQuickSearchContainer from './GlobalQuickSearchContainer';
import configureSearchProviders, {
  SearchProviders,
} from '../api/configureSearchProviders';

export interface Props {
  cloudId: string;
  environment: 'local' | 'development' | 'staging' | 'production';
}

export interface State extends SearchProviders {}

export default class GlobalQuickSearchConfiguration extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = configureSearchProviders(props.cloudId, props.environment);
  }

  render() {
    return <GlobalQuickSearchContainer {...this.state} />;
  }
}
