// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shouldReportItemHeight } from './shared-variables';
import type { ReactElement } from '../../../types';

type Props = {
  children: ReactElement,
};

export default class OverflowHeightReportEnabler extends Component {
  props: Props; // eslint-disable-line react/sort-comp

  static childContextTypes = {
    [shouldReportItemHeight]: PropTypes.bool,
  }

  getChildContext() {
    return {
      [shouldReportItemHeight]: true,
    };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
