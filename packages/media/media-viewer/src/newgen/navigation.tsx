
import * as React from 'react';
import { Component } from 'react';
import { Identifier } from './domain';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { colors } from '@atlaskit/theme';
import { ArrowsWrapper, RightWrapper, LeftWrapper } from './styled';

export type NavigationDirection = 'prev' | 'next';

export interface NavigationProps {
  items: Identifier[];
  selectedItem: Identifier;
  onChange: (item: Identifier) => void;
}

export default class Navigation extends Component<NavigationProps, any> {
  private navigate(direction: NavigationDirection) {
    return () => {
      const {onChange, items} = this.props;
      const {selectedIndex} = this;
      const newItem = direction === 'next' ? items[selectedIndex + 1] : items[selectedIndex - 1];
      onChange(newItem);
    };
  }
  get selectedIndex() {
    const {items, selectedItem} = this.props;
    return items.findIndex(item => item.id === selectedItem.id);
  }
  render() {
    const { items } = this.props;
    const {selectedIndex} = this;
    const isLeftVisible = selectedIndex > 0;
    const isRightVisible = selectedIndex < items.length - 1;

    return (
      <ArrowsWrapper>

        {isLeftVisible ? (
          <LeftWrapper onClick={this.navigate('prev')}>
            <ArrowLeftCircleIcon primaryColor={colors.N800} size='xlarge' label='Previous'/>
          </LeftWrapper>
        ) : null}

        {isRightVisible ? (
          <RightWrapper onClick={this.navigate('next')}>
            <ArrowRightCircleIcon primaryColor={colors.N800} size='xlarge' label='Next'/>
          </RightWrapper>
        ) : null}

      </ArrowsWrapper>
    );
  }
}