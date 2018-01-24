// @flow

import React, { Component, type Node } from 'react';
import reactAddonsTextContent from 'react-addons-text-content';
import snackeCase from 'snake-case';

type Props = {
  children?: Node,
  level: number,
};

type State = {
  shouldShowAnchor: boolean,
};

function dashcase(children) {
  return snackeCase(reactAddonsTextContent(children)).replace(/_/g, '-');
}

export default class extends Component<Props, State> {
  state = {
    shouldShowAnchor: false,
  };
  handleShowAnchor = () => {
    this.setState({ shouldShowAnchor: true });
  };
  handleHideAnchor = () => {
    this.setState({ shouldShowAnchor: false });
  };
  render() {
    const { handleHideAnchor, handleShowAnchor } = this;
    const { children, level } = this.props;
    const { shouldShowAnchor } = this.state;
    const Tag = `h${level}`;
    const id = dashcase(children);
    return (
      <Tag
        id={id}
        onMouseEnter={handleShowAnchor}
        onMouseLeave={handleHideAnchor}
      >
        {children}
        {shouldShowAnchor ? ' ' : ''}
        {shouldShowAnchor ? <a href={`#${id}`}>#</a> : ''}
      </Tag>
    );
  }
}
