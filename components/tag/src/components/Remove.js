// @flow
import * as React from 'react';
import RemoveIcon from '@atlaskit/icon/glyph/cross';
import Button from '../styled/Remove';

type Props = {
  removeText: string,
  isRounded?: bool,
  onHoverChange?: (hovering: bool) => mixed,
  onRemoveAction?: () => mixed,
}

export default class Remove extends React.PureComponent<Props> {
  onKeyPress = (e: KeyboardEvent) => {
    const spacebarOrEnter = (e.key === ' ' || e.key === 'Enter');

    if (spacebarOrEnter) {
      e.stopPropagation();
      if (this.props.onRemoveAction) {
        this.props.onRemoveAction();
      }
    }
  }

  onMouseOver = () => {
    if (this.props.onHoverChange) this.props.onHoverChange(true);
  };

  onMouseOut = () => {
    if (this.props.onHoverChange) this.props.onHoverChange(false);
  }

  render() {
    const { isRounded, onRemoveAction, removeText } = this.props;

    return (
      <Button
        aria-label={removeText}
        isRounded={isRounded}
        onClick={onRemoveAction}
        onKeyPress={this.onKeyPress}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        type="button"
      >
        <RemoveIcon label={removeText} size="small" />
      </Button>
    );
  }
}
