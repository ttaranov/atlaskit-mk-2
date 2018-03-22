// @flow
import React, { PureComponent } from 'react';

import AkProfilecardStatic from './profilecard';

import { ProfileCardAction, ProfileClient } from '../types';

type Props = {
  userId: string,
  cloudId: string,
  actions: ProfileCardAction[],
  resourceClient: ProfileClient,
  analytics: Function,
};

type State = {
  isLoading: boolean,
  hasError: boolean,
  error: any,
  data: any,
};

export default class ProfilecardResourced extends PureComponent<Props, State> {
  static defaultProps = {
    actions: [],
  };

  _isMounted: boolean;

  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  state = {
    isLoading: false,
    hasError: false,
    error: null,
    data: {},
  };

  componentDidMount() {
    this._isMounted = true;
    this.clientFetchProfile();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.userId !== prevProps.userId ||
      this.props.cloudId !== prevProps.cloudId
    ) {
      this.clientFetchProfile();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  clientFetchProfile = () => {
    const { cloudId, userId } = this.props;

    this.setState({
      isLoading: true,
      hasError: false,
      data: {},
    });

    this.props.resourceClient
      .getProfile(cloudId, userId)
      .then(
        res => this.handleClientSuccess(res),
        err => this.handleClientError(err),
      )
      .catch(err => this.handleClientError(err));
  };

  handleClientSuccess(res) {
    if (!this._isMounted) {
      return;
    }

    this.setState({
      isLoading: false,
      hasError: false,
      data: res,
    });
  }

  handleClientError(err) {
    if (!this._isMounted) {
      return;
    }
    this.setState({
      isLoading: false,
      hasError: true,
      error: err,
    });
  }

  filterActions() {
    return this.props.actions.filter(action => {
      if (!action.shouldRender) {
        return true;
      } else if (typeof action.shouldRender !== 'function') {
        return Boolean(action.shouldRender);
      }

      return action.shouldRender(this.state.data);
    });
  }

  render() {
    const newProps = {
      isLoading: this.state.isLoading,
      hasError: this.state.hasError,
      errorType: this.state.error,
      clientFetchProfile: this.clientFetchProfile,
      analytics: this.props.analytics,
      ...this.state.data,
    };

    return <AkProfilecardStatic {...newProps} actions={this.filterActions()} />;
  }
}
