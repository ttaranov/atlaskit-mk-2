// @flow

import React, { Component, type Node } from 'react';
import Base from '@atlaskit/field-base';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { akColorN60 } from '@atlaskit/util-shared-styles';

type Handler = (e: any) => void;
type Props = {
  shouldShowIcon: bool,
  onIconClick: Handler,
  isDisabled: bool,
  children: Node
};

export default class Container extends Component<Props> {
  props: Props;

  static defaultProps = {
    isDisabled: false,
    shouldShowIcon: false,
    onIconClick() {},
  }

  handleIconClick = (e: MouseEvent) => {
    if (!this.props.isDisabled) {
      this.props.onIconClick(e);
    }
  }

  maybeRenderIcon() {
    if (!this.props.shouldShowIcon) {
      return null;
    }

    // Wrapping div to ensure the icon stays at full width
    // TODO: i18n label
    return (
      <div style={{ minWidth: '24px' }}>
        <CalendarIcon
          label="Show calendar"
          onClick={this.props.onIconClick}
          primaryColor={this.props.isDisabled ? akColorN60 : undefined}
        />
      </div>
    );
  }

  render() {
    return (
      <Base
        isDisabled={this.props.isDisabled}
      >
        {this.props.children}
        {this.maybeRenderIcon()}
      </Base>
    );
  }
}
