// @flow

import React, { type Node, Component } from 'react';

import { light, styleReducerNoOp, withTheme } from '../../theme';
import type { Theme, StyleReducer } from '../../theme/types';

type Props = {
  children: Node,
  theme: Theme,
  styles: StyleReducer<void>,
};

class ScrollableSectionInner extends Component<Props> {
  static defaultProps = {
    styles: styleReducerNoOp,
    theme: { mode: light, context: 'container' },
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

export default withTheme(ScrollableSectionInner);
