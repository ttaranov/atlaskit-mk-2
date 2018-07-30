// @flow

/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withNavigationViewController } from '../../../src';

export const Page = (p: *) => <div style={{ padding: 32 }} {...p} />;

type Props = {
  id: string,
  navigationViewController: *,
};

class SetNavView extends Component<Props> {
  componentDidMount() {
    this.props.navigationViewController.setView(this.props.id);
  }
  render() {
    return null;
  }
}

export const ViewSetter = withNavigationViewController(SetNavView);

export const PageView = ({ children, currentNavView }: *) => {
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
