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
import { getSelectedIndex } from './utils';
import { Shortcut } from './shortcut';

export type NavigationDirection = 'prev' | 'next';

export interface NavigationProps {
  items: Identifier[];
  selectedItem: Identifier;
  onChange: (item: Identifier) => void;
}

export default class Navigation extends Component<NavigationProps, any> {
  private navigate(direction: NavigationDirection) {
    return () => {
      const { onChange, items } = this.props;
      const { selectedIndex } = this;
      const newItem =
        direction === 'next'
          ? items[selectedIndex + 1]
          : items[selectedIndex - 1];

      if (newItem) {
        onChange(newItem);
      }
    };
  }

  get selectedIndex() {
    const { items, selectedItem } = this.props;
    return getSelectedIndex(items, selectedItem);
  }

  render() {
    const { items } = this.props;
    const { selectedIndex } = this;

    if (selectedIndex === -1) {
      return null;
    }

    const isLeftVisible = selectedIndex > 0;
    const isRightVisible = selectedIndex < items.length - 1;

    const prev = this.navigate('prev');
    const next = this.navigate('next');

    return (
      <ArrowsWrapper>
        <LeftWrapper>
          {isLeftVisible ? (
            <Arrow className={hideControlsClassName}>
              <Shortcut keyCode={37} handler={prev} />
              <ArrowLeftCircleIcon
                onClick={prev}
                primaryColor={colors.N800}
                size="xlarge"
                label="Previous"
              />
            </Arrow>
          ) : null}
        </LeftWrapper>

        <RightWrapper>
          {isRightVisible ? (
            <Arrow className={hideControlsClassName}>
              <Shortcut keyCode={39} handler={next} />
              <ArrowRightCircleIcon
                onClick={next}
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
