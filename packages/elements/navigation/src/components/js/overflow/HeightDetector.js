// @flow

import React, { Component } from 'react';
import SizeDetector from '@atlaskit/size-detector';
import rafSchd from 'raf-schd';
import type { ReactElement } from '../../../types';

type Props = {
  children: ReactElement,
  onHeightChange: (height: number) => {},
}

export default class HeightDetector extends Component {
  props: Props

  notifyHeight = rafSchd((height) => {
    this.props.onHeightChange(height);
  })

  render() {
    return (
      <SizeDetector>
        {
          (size) => {
            this.notifyHeight(size.height);
            return this.props.children;
          }
        }
      </SizeDetector>
    );
  }
}
