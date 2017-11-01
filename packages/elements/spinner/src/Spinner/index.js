// @flow

import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';

import { Glyph } from '../Glyph';
import type { SpinnerProps } from '../types';

export default class Spinner extends Component<SpinnerProps> {
  static defaultProps = {
    delay: 100,
    isCompleting: false,
    invertColor: false,
    onComplete: () => {},
    size: 'small',
  }

  render() {
    const { isCompleting, ...glyphProps } = this.props;
    return (
      <TransitionGroup
        component="div"
        style={{ display: 'inline-block' }}
      >
        {!isCompleting ? (
          <Glyph key={Date.now()} {...glyphProps} />
        ) : null}
      </TransitionGroup>
    );
  }
}
