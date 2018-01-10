// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { overflowGroupNamespace, shouldReportItemHeight } from './shared-variables';
import type { ReactElement } from '../../../types';

type Props = {
  overflowItemIndex: number,
  children: ReactElement
}

export default class OverflowItem extends Component {
  props: Props // eslint-disable-line react/sort-comp

  static contextTypes = {
    [overflowGroupNamespace]: PropTypes.object,
    [shouldReportItemHeight]: PropTypes.bool,
  }

  measureHeight = (rootNode: HTMLElement) => {
    if (rootNode) {
      this.context[overflowGroupNamespace].reportItemHeightToGroup(
        this.props.overflowItemIndex,
        rootNode.clientHeight
      );
    }
  }

  render() {
    if (!this.context[overflowGroupNamespace].shouldRenderItem(this.props.overflowItemIndex)) {
      return null;
    }

    if (this.context[shouldReportItemHeight]) {
      return (
        <div ref={this.measureHeight}>
          {this.props.children}
        </div>
      );
    }

    return this.props.children;
  }
}
