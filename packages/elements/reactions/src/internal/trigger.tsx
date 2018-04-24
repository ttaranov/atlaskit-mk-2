import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';
import { borderRadius, colors } from '@atlaskit/theme';
import * as cx from 'classnames';
import * as React from 'react';
import { PureComponent } from 'react';
import { style } from 'typestyle';
import { isLeftClick } from './helpers';

const akBorderRadius = borderRadius();
const akColorN30A = colors.N30A;
const akColorN500 = colors.N500;

export interface Props {
  onClick: Function;
  miniMode?: boolean;
}

const triggerStyle = style({
  color: akColorN500,
  background: 'transparent',
  border: 0,
  borderRadius: akBorderRadius,
  cursor: 'pointer',
  boxSizing: 'border-box',
  padding: 0,
  margin: 0,
  width: '32px',
  height: '32px',
  $nest: {
    '&:hover, &:active': {
      background: akColorN30A,
    },
    '&.miniMode': {
      width: '24px',
      height: '24px',
      overflow: 'hidden',
      verticalAlign: 'middle',
    },
  },
});

export default class Trigger extends PureComponent<Props, {}> {
  private handleMouseDown = event => {
    event.preventDefault();
    if (this.props.onClick && isLeftClick(event)) {
      this.props.onClick(event);
    }
  };

  render() {
    const classNames = cx(triggerStyle, {
      miniMode: this.props.miniMode,
    });

    return (
      <button className={classNames} onMouseDown={this.handleMouseDown}>
        {<EmojiAddIcon size="small" label="Add reaction" />}
      </button>
    );
  }
}
