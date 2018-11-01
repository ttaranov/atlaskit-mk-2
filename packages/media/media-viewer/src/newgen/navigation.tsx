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
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next-types';
import { getSelectedIndex } from './utils';
import { Shortcut } from './shortcut';
import { channel } from './analytics';
import {
  createNavigationEvent,
  NavigationGasPayload,
} from './analytics/navigation';

export type NavigationDirection = 'prev' | 'next';

export type NavigationProps = Readonly<{
  items: Identifier[];
  selectedItem: Identifier;
  onChange: (item: Identifier) => void;
}> &
  WithAnalyticsEventProps;

export type NavigationSource = 'keyboard' | 'mouse';
export class NavigationBase extends Component<NavigationProps, {}> {
  private navigate(direction: NavigationDirection, source: NavigationSource) {
    return () => {
      const { onChange, items } = this.props;
      const { selectedIndex } = this;
      const newItem =
        direction === 'next'
          ? items[selectedIndex + 1]
          : items[selectedIndex - 1];

      if (newItem) {
        this.fireAnalytics(createNavigationEvent(direction, source, newItem));
        onChange(newItem);
      }
    };
  }

  private fireAnalytics = (payload: NavigationGasPayload) => {
    if (this.props.createAnalyticsEvent) {
      const ev = this.props.createAnalyticsEvent(payload);
      ev.fire(channel);
    }
  };

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

    const prev = (source: NavigationSource) => this.navigate('prev', source);
    const next = (source: NavigationSource) => this.navigate('next', source);

    return (
      <ArrowsWrapper>
        <LeftWrapper>
          {isLeftVisible ? (
            <Arrow className={hideControlsClassName}>
              <Shortcut keyCode={37} handler={prev('keyboard')} />
              <ArrowLeftCircleIcon
                onClick={prev('mouse')}
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
              <Shortcut keyCode={39} handler={next('keyboard')} />
              <ArrowRightCircleIcon
                onClick={next('mouse')}
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

export const Navigation = withAnalyticsEvents({})(NavigationBase);
