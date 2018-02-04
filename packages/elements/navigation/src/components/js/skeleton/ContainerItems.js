// @flow
import React, { Component } from 'react';

import ContainerItem from './ContainerItem';

import NavigationItems from '../../styled/skeleton/NavigationItems';

export type Props = {
  isCollapsed: boolean,
};

export default class ContainerItems extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    return (
      <NavigationItems>
        <ContainerItem isCollapsed={this.props.isCollapsed} />
        <ContainerItem isCollapsed={this.props.isCollapsed} />
        <ContainerItem isCollapsed={this.props.isCollapsed} />
        <ContainerItem isCollapsed={this.props.isCollapsed} />
        <ContainerItem isCollapsed={this.props.isCollapsed} />
      </NavigationItems>
    );
  }
}
