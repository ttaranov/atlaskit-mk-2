// @flow

import React, { Component } from 'react';

import { styleReducerNoOp, withContentTheme } from '../../theme';
import type { ScrollableSectionInnerProps } from './types';

class ScrollableSectionInner extends Component<ScrollableSectionInnerProps> {
  static defaultProps = {
    styles: styleReducerNoOp,
  };

  render() {
    const { children, styles: styleReducer, theme } = this.props;

    const { mode, context } = theme;
    const styles = styleReducer(mode.scrollHint()[context]);

    return (
      <div css={styles.wrapper}>
        <div css={styles.inner}>{children}</div>
      </div>
    );
  }
}

export default withContentTheme(ScrollableSectionInner);
