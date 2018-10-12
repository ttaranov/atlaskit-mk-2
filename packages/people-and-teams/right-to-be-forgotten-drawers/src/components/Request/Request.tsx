import React from 'react';
import { RequestProps, RequestState, CallbackArguments } from './types';

const defaultState: RequestState = {
  loading: false,
  error: undefined,
  data: undefined,
};

/**
 * Apollo-inspired render-prop component for wrapping requests/promises
 */
export class Request extends React.Component<RequestProps, RequestState> {
  state = defaultState;

  /**
   * Send request on mount if props.fireOnMount is true
   */
  componentDidMount() {
    const { fireOnMount, variables } = this.props;
    if (fireOnMount) {
      if (variables) {
        this.sendRequest(...variables);
      } else {
        this.sendRequest();
      }
    }
  }

  setStateToRejected = error =>
    this.setState({
      data: null,
      error,
      loading: false,
    });

  setStateToPending = () =>
    this.setState(state => ({
      data: state.data,
      error: null,
      loading: true,
    }));

  setStateToFulfilled = data =>
    this.setState({
      data,
      error: null,
      loading: false,
    });

  /**
   * Makes the async request, keeping the child render function up-to-date with
   * the state of the request.
   */
  sendRequest = async (...args: CallbackArguments) => {
    const requestArguments = args.length ? args : this.props.variables;
    const request = requestArguments
      ? () => this.props.request(...requestArguments)
      : () => this.props.request();
    try {
      // Make the request, set state to pending
      this.setStateToPending();
      const resp = await request();
      // On success, set state to fulfilled
      this.setStateToFulfilled(resp);
    } catch (e) {
      // On error, set state to rejected
      this.setStateToRejected(e);
    }
  };

  render() {
    return this.props.children(this.state, this.sendRequest);
  }
}

export default Request;
