// @flow

import React, { Component } from 'react';
import { RootViewSubscriber } from '../../../src';

export const Page = p => <div style={{ padding: 32 }} {...p} />;

type Props = {
  id: string,
  setView: any => void,
};

class SetNavViewLifecycleProvider extends Component<Props> {
  componentDidMount() {
    this.props.setView(this.props.id);
  }
  render() {
    return null;
  }
}

export const SetNavView = props => (
  <RootViewSubscriber>
    {something => <SetNavViewLifecycleProvider {...props} {...something} />}
  </RootViewSubscriber>
);
