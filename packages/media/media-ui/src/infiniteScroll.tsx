import * as React from 'react';
import { Component, UIEvent } from 'react';
import * as debounce from 'lodash.debounce';

export type ThresholdReachedEventHandler = () => void;

export interface InfiniteScrollProps {
  readonly height?: number | string;
  readonly width?: string;
  readonly delay?: number;
  readonly threshold?: number;

  readonly onThresholdReached?: ThresholdReachedEventHandler;
}

export interface InfiniteScrollState {}

export class InfiniteScroll extends Component<
  InfiniteScrollProps,
  InfiniteScrollState
> {
  static defaultProps = {
    width: '100%',
    delay: 1000,
    threshold: 100,
  };

  private readonly emitOnThresholdReachedWithDebounce = debounce(
    this.emitOnThresholdReached,
    this.props.delay,
    {
      leading: true,
      trailing: true,
    },
  );

  private scrollHeight: number = 0;

  render(): JSX.Element {
    const { width, height, children } = this.props;
    return (
      <div
        style={{
          width,
          height,
          overflowX: 'hidden',
          overflowY: 'auto',
          msOverflowStyle: 'scrollbar',
          display: 'inline-block',
        }}
        onScroll={this.checkThreshold}
      >
        {children}
      </div>
    );
  }

  private checkThreshold = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const threshold = this.props.threshold || 0;
    const position = target.scrollTop + target.offsetHeight;
    const thresholdModifier = 0.1;
    const adjustedThreshold = Math.min(
      threshold,
      target.scrollHeight * thresholdModifier,
    );

    const thresholdReached =
      position > this.scrollHeight &&
      position > target.scrollHeight - adjustedThreshold;

    if (thresholdReached) {
      this.scrollHeight = target.scrollHeight;

      this.emitOnThresholdReachedWithDebounce();
    }
  };

  private emitOnThresholdReached(): void {
    if (this.props.onThresholdReached) {
      this.props.onThresholdReached();
    }
  }
}
