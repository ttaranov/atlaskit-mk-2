import * as React from 'react';
import { Component } from 'react';
import {
  TimeLine,
  CurrentTimeLine,
  Thumb,
  BufferedTime,
  CurrentTimeTooltip,
  TimeRangeWrapper,
} from './styled';
import { formatDuration } from '../../utils/formatDuration';

export interface TimeRangeProps {
  currentTime: number;
  bufferedTime: number;
  duration: number;
  onChange: (newTime: number) => void;
}

export interface TimeRangeState {
  isDragging: boolean;
}

export class TimeRange extends Component<TimeRangeProps, TimeRangeState> {
  wrapperElement?: HTMLElement;
  thumbElement?: HTMLElement;

  wrapperElementWidth: number = 0;

  state: TimeRangeState = {
    isDragging: false,
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('resize', this.setWrapperWidth);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('resize', this.setWrapperWidth);
  }

  private setWrapperWidth = () => {
    if (!this.wrapperElement) {
      return;
    }

    this.wrapperElementWidth = this.wrapperElement.getBoundingClientRect().width;
  };

  onMouseMove = (e: MouseEvent) => {
    const { isDragging } = this.state;
    if (!isDragging) {
      return;
    }
    e.stopPropagation();

    const { currentTime, onChange, duration } = this.props;
    const { movementX } = e;
    const movementPercentage =
      Math.abs(movementX) * duration / this.wrapperElementWidth;
    const newTime =
      currentTime + (movementX > 0 ? movementPercentage : -movementPercentage);
    const newTimeWithBoundaries = Math.min(Math.max(newTime, 0), duration);

    onChange(newTimeWithBoundaries);
  };

  onMouseUp = (e: MouseEvent) => {
    e.stopPropagation();

    this.setState({
      isDragging: false,
    });
  };

  onThumbMouseDown = () => {
    this.setState({
      isDragging: true,
    });
  };

  onNavigate = (e: any) => {
    // We don't want to navigate if the event was starting with a drag
    if (e.target === this.thumbElement) {
      return;
    }

    const { duration, onChange } = this.props;
    const event = e.nativeEvent;
    const thumbCorrection = 8; // This is to actually center the thumb in the middle of the cursor
    const x = event.x - thumbCorrection;
    const currentTime = x * duration / this.wrapperElementWidth;

    onChange(currentTime);
  };

  private saveWrapperElement = (el?: HTMLElement) => {
    if (el) {
      this.wrapperElement = el;
      this.setWrapperWidth();
    }
  };

  private saveThumbElement = (el?: HTMLElement) => {
    if (el) {
      this.thumbElement = el;
    }
  };

  render() {
    const { isDragging } = this.state;
    const { currentTime, duration, bufferedTime } = this.props;
    const currentPosition = currentTime * 100 / duration;
    const bufferedTimePercentage = bufferedTime * 100 / duration;

    return (
      <TimeRangeWrapper onClick={this.onNavigate}>
        <TimeLine className="timeline" innerRef={this.saveWrapperElement}>
          <BufferedTime style={{ width: `${bufferedTimePercentage}%` }} />
          <CurrentTimeLine style={{ width: `${currentPosition}%` }}>
            <Thumb
              innerRef={this.saveThumbElement}
              onMouseDown={this.onThumbMouseDown}
              className="time-range-thumb"
            >
              <CurrentTimeTooltip
                isDragging={isDragging}
                className="current-time-tooltip"
              >
                {formatDuration(currentTime)}
              </CurrentTimeTooltip>
            </Thumb>
          </CurrentTimeLine>
        </TimeLine>
      </TimeRangeWrapper>
    );
  }
}
