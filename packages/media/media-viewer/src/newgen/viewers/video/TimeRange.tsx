import * as React from 'react';
import { Component } from 'react';
import {
  TimeLine,
  CurrentTimeLine,
  Thumb,
  BufferedTime,
  CurrentTimeTooltip,
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
  wrapperElement: HTMLElement;
  thumbElement: HTMLElement;
  state: TimeRangeState = {
    isDragging: false,
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (e: MouseEvent) => {
    const { isDragging } = this.state;
    if (!isDragging) {
      return;
    }
    e.stopPropagation();
    // TODO: how to not read wrapper dimensions on every move?
    // subscribe to window.resize should cover all the cases since we are
    // using position: absolute
    const { currentTime, onChange, duration } = this.props;
    const { movementX } = e;
    const movementPercentage =
      Math.abs(movementX) * duration / this.getWrapperWidth();
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

  onNavigate = e => {
    // We don't want to navigate if the event was starting with a drag
    if (e.target === this.thumbElement) {
      return;
    }

    const { duration, onChange } = this.props;
    const event = e.nativeEvent;
    const thumbCorrection = 8;
    const x = event.x - thumbCorrection;
    const currentTime = x * duration / this.getWrapperWidth();

    onChange(currentTime);
  };

  private getWrapperWidth(): number {
    return this.wrapperElement.getBoundingClientRect().width;
  }

  private saveWrapperElement = el => {
    if (el) {
      this.wrapperElement = el;
    }
  };

  private saveThumbElement = el => {
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
      <TimeLine innerRef={this.saveWrapperElement} onClick={this.onNavigate}>
        <BufferedTime style={{ width: `${bufferedTimePercentage}%` }} />
        <CurrentTimeLine style={{ width: `${currentPosition}%` }}>
          <Thumb
            innerRef={this.saveThumbElement}
            onMouseDown={this.onThumbMouseDown}
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
    );
  }
}
