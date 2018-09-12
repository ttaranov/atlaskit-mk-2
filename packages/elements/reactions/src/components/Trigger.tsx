import Button from '@atlaskit/button';
import EmojiAddIcon from '@atlaskit/icon/glyph/emoji-add';
import * as cx from 'classnames';
import * as React from 'react';
import { PureComponent } from 'react';
import { style } from 'typestyle';

export interface Props {
  onClick: Function;
  miniMode?: boolean;
  disabled?: boolean;
}

const triggerStyle = style({
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '16px',
  $nest: {
    '&.miniMode': {
      width: '24px',
      height: '24px',
    },
  },
});

export class Trigger extends PureComponent<Props, {}> {
  static defaultProps = {
    disabled: false,
  };

  private handleMouseDown = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
    const { miniMode, disabled } = this.props;
    const classNames = cx(triggerStyle, { miniMode });

    return (
      <Button
        className={classNames}
        appearance="subtle"
        onClick={this.handleMouseDown}
        isDisabled={disabled}
        spacing="none"
      >
        <EmojiAddIcon size="small" label="Add reaction" />
      </Button>
    );
  }
}
