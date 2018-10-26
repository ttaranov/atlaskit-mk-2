// @flow
import React, { Component, type Node } from 'react';
import BreadcrumbsStateless from './BreadcrumbsStateless';

type Props = {
  children?: Node,
};

type State = {|
  isExpanded: boolean,
|};

export default function Breadcrumbs (props) {
  props: Props;

  static defaultProps = {
    children: null,
  };

  const state = useState({ isExpanded: false };

  expand = () => this.setState({ isExpanded: true });

  render() {
    return (
      <BreadcrumbsStateless
        {...this.props}
        isExpanded={this.state.isExpanded}
        onExpand={this.expand}
      />
    );
  }
}
