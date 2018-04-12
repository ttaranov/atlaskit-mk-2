// @flow

import React, { Component } from 'react';
import { css } from 'emotion';
import raf from 'raf-schd';
import { colors } from '@atlaskit/theme';

import ChevronLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ChevronRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';

type Props = {
  navigation: Object,
};
type State = {
  isVisible: boolean,
  initialWidth: number,
  initialX: number,
};

export default class ResizeControl extends Component<Props, State> {
  state = {
    isVisible: false,
    initialWidth: 0,
    initialX: 0,
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  collapseProductNav = () => {
    this.props.navigation.collapseProductNav();
    this.hide();
  };

  expandProductNav = () => {
    this.props.navigation.expandProductNav();
    this.hide();
  };

  handleResizeStart = (event: MouseEvent) => {
    this.props.navigation.manualResizeStart();
    this.setState({
      initialWidth: this.props.navigation.state.productNavWidth,
      initialX: event.pageX,
    });
    window.addEventListener('mousemove', this.handleResize);
    window.addEventListener('mouseup', this.handleResizeEnd);
  };

  handleResize = raf((event: MouseEvent) => {
    if (this.props.navigation.state.isResizing) {
      const delta = event.pageX - this.state.initialX;
      const width = this.state.initialWidth + delta;
      this.props.navigation.resizeProductNav(width);
    }
  });

  handleResizeEnd = () => {
    window.removeEventListener('mousemove', this.handleResize);
    window.removeEventListener('mouseup', this.handleResizeEnd);
    this.props.navigation.manualResizeEnd();
  };

  render() {
    const { isVisible } = this.state;
    const { navigation } = this.props;
    const { productNavIsCollapsed } = navigation.state;

    return (
      <div
        className={css({
          opacity: navigation.state.isResizing || isVisible ? 1 : 0,
          transition: 'opacity 300ms cubic-bezier(0.2, 0, 0, 1) 80ms',
          width: 32,
        })}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
      >
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <div
          className={css({
            background: colors.B200,
            cursor: 'ew-resize',
            height: '100%',
            position: 'absolute',
            width: 2,
          })}
          onMouseDown={this.handleResizeStart}
        />
        {/* eslint-enable */}
        <div
          className={css({
            cursor: 'pointer',
            height: 24,
            margin: 10,
            position: 'absolute',
            width: 24,
          })}
        >
          {!productNavIsCollapsed ? (
            <ChevronLeftCircleIcon
              primaryColor={colors.B200}
              onClick={this.collapseProductNav}
            />
          ) : (
            <ChevronRightCircleIcon
              primaryColor={colors.B200}
              onClick={this.expandProductNav}
            />
          )}
        </div>
      </div>
    );
  }
}
