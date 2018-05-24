import * as React from 'react';
import { Component } from 'react';
import { Identifier } from './domain';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { colors } from '@atlaskit/theme';
import {
  ArrowsWrapper,
  RightWrapper,
  LeftWrapper,
  Arrow,
  hideControlsClassName,
} from './styled';
import { getSelectedIndex } from './util';
import { Shortcut } from './shortcut';
import { triggerMovementCheck } from './content';

export type NavigationDirection = 'prev' | 'next';

export interface NavigationProps {
  items: Identifier[];
  selectedItem: Identifier;
  onChange: (item: Identifier) => void;
}

export default class Navigation extends Component<NavigationProps, any> {
  private navigate = (direction: NavigationDirection) => () => {
    const { onChange, items } = this.props;
    const { selectedIndex } = this;
    const newItem =
      direction === 'next'
        ? items[selectedIndex + 1]
        : items[selectedIndex - 1];

    if (newItem) {
      onChange(newItem);
    }

    triggerMovementCheck(this);
  };

  get selectedIndex() {
    const { items, selectedItem } = this.props;
    return getSelectedIndex(items, selectedItem);
  }

  private prev = this.navigate('prev');
  private next = this.navigate('next');

  render() {
    const { items } = this.props;
    const { selectedIndex } = this;

    if (selectedIndex === -1) {
      return null;
    }

    const isLeftVisible = selectedIndex > 0;
    const isRightVisible = selectedIndex < items.length - 1;

    return (
      <ArrowsWrapper className={hideControlsClassName}>
        <LeftWrapper>
          {isLeftVisible ? (
            <Arrow>
              <Shortcut keyCode={37} handler={this.prev} />
              <ArrowLeftCircleIcon
                onClick={this.prev}
                primaryColor={colors.N800}
                size="xlarge"
                label="Previous"
              />
            </Arrow>
          ) : null}
        </LeftWrapper>

        <RightWrapper>
          {isRightVisible ? (
            <Arrow>
              <Shortcut keyCode={39} handler={this.next} />
              <ArrowRightCircleIcon
                onClick={this.next}
                primaryColor={colors.N800}
                size="xlarge"
                label="Next"
              />
            </Arrow>
          ) : null}
        </RightWrapper>
      </ArrowsWrapper>
    );
  }
}
