import * as React from 'react';
import { Component, UIEvent } from 'react';
import * as debounce from 'lodash.debounce';
import { Wrapper } from './styled';

export type ThresholdReachedEventHandler = () => void;

export interface InfiniteScrollProps {
  readonly width?: string;
  readonly height?: number;
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

  componentDidMount() {}

  render(): JSX.Element {
    const { width, height } = this.props;
    return (
      <Wrapper
        width={width || '100%'}
        height={height}
        onScroll={this.checkThreshold}
      >
        {this.props.children}
      </Wrapper>
    );
  }

  private checkThreshold = (event: UIEvent<HTMLDivElement>) => {
    const { threshold = 100 } = this.props;

    const target = event.currentTarget;
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
    const { onThresholdReached } = this.props;
    if (onThresholdReached) {
      onThresholdReached();
    }
  }
}
