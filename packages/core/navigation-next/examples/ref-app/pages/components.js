// @flow

/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ContainerViewSubscriber, RootViewSubscriber } from '../../../src';

export const Page = (p: *) => <div style={{ padding: 32 }} {...p} />;

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

export const SetNavView = (props: *) => (
  <RootViewSubscriber>
    {something => <SetNavViewLifecycleProvider {...props} {...something} />}
  </RootViewSubscriber>
);

export const SetContainerNavView = (props: *) => (
  <ContainerViewSubscriber>
    {something => <SetNavViewLifecycleProvider {...props} {...something} />}
  </ContainerViewSubscriber>
);

export const PageView = ({ children, currentNavView }: *) => {
  const ViewSetter = currentNavView.startsWith('root/')
    ? SetNavView
    : SetContainerNavView;
  return (
    <Page>
      <ViewSetter id={currentNavView} />
      {children}
    </Page>
  );
};

class ProjectSwitcherWithRouter extends Component<*, *> {
  state = {
    value: this.props.initialValue,
  };

  onChange = (e: *) => {
    const { history } = this.props;
    const value = e.target.value;
    this.setState({ value });
    history.push(`/projects/${value}`);
  };

  render() {
    console.log(this.props);
    const { items } = this.props;
    const { value } = this.state;
    return (
      <select value={value} onChange={this.onChange}>
        {items.map(({ name, id }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    );
  }
}

export const ProjectSwitcher = withRouter(ProjectSwitcherWithRouter);
