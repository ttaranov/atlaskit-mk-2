import * as React from 'react';
import rafSchedule from 'raf-schd';
import { browser } from '@atlaskit/editor-common';
import { shadowClassNames } from './Renderer/style';

export interface OverflowShadowProps {
  handleRef: (ref: HTMLElement | null) => void;
  shadowClassNames: string;
}

export interface OverflowShadowState {
  showLeftShadow: boolean;
  showRightShadow: boolean;
}

export interface OverflowShadowOptions {
  overflowSelector: string;
  scrollableSelector: string;
}

const isIE11 = browser.ie_version === 11;

export default function overflowShadow<P extends OverflowShadowProps>(
  Component: React.ComponentType<P>,
  options: OverflowShadowOptions,
) {
  return class OverflowShadow extends React.Component<
    Pick<P, Exclude<keyof P, keyof OverflowShadowProps>>,
    OverflowShadowState
  > {
    overflowContainer: HTMLElement;
    scrollable: NodeList;

    state = {
      showLeftShadow: false,
      showRightShadow: false,
    };

    componentWillUnmount() {
      if (this.overflowContainer && !isIE11) {
        this.overflowContainer.removeEventListener(
          'scroll',
          this.handleScrollDebounced,
        );
      }

      this.handleUpdateRightShadow.cancel();
      this.handleScrollDebounced.cancel();
    }

    componentDidUpdate() {
      this.handleUpdateRightShadow();
    }

    handleScroll = (event: Event) => {
      if (!this.overflowContainer || event.target !== this.overflowContainer) {
        return;
      }

      this.setState(() => ({
        showLeftShadow: this.overflowContainer.scrollLeft > 0,
      }));
    };

    updateRightShadow = () => {
      if (this.overflowContainer && this.scrollable.length) {
        const scrollableWidth = this.calcualteScrollableWidth();
        const diff = scrollableWidth - this.overflowContainer.offsetWidth;
        const showRightShadow =
          diff > 0 && diff > this.overflowContainer.scrollLeft;

        if (showRightShadow !== this.state.showRightShadow) {
          this.setState(() => ({
            showRightShadow,
          }));
        }
      }
    };

    handleUpdateRightShadow = rafSchedule(this.updateRightShadow);
    handleScrollDebounced = rafSchedule(this.handleScroll);

    calcualteScrollableWidth = () => {
      let width = 0;
      for (let i = 0; i < this.scrollable.length; i++) {
        const scrollableElement = this.scrollable[i] as HTMLElement;
        width += scrollableElement.scrollWidth;
      }
      return width;
    };

    handleContainer = container => {
      if (!container) {
        return;
      }

      this.overflowContainer = container.querySelector(
        options.overflowSelector,
      );
      this.scrollable = container.querySelectorAll(options.scrollableSelector);

      if (!(this.overflowContainer && this.scrollable)) {
        return;
      }

      this.updateRightShadow();
      if (!isIE11) {
        this.overflowContainer.addEventListener(
          'scroll',
          this.handleScrollDebounced,
        );
      }
    };

    render() {
      const { showLeftShadow, showRightShadow } = this.state;

      const classNames = [
        showRightShadow && shadowClassNames.RIGHT_SHADOW,
        showLeftShadow && shadowClassNames.LEFT_SHADOW,
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <Component
          handleRef={this.handleContainer}
          shadowClassNames={classNames}
          {...this.props}
        />
      );
    }
  };
}
