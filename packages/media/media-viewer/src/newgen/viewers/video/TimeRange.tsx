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

    const { currentTime, onChange, duration } = this.props;
    const { movementX } = e;
    const thumbCorrection = 18;
    const movementPercentage =
      Math.abs(movementX) * 100 / duration / thumbCorrection;
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
    const { duration, onChange } = this.props;
    const event = e.nativeEvent;
    const x = event.x;
    const width = e.currentTarget.getBoundingClientRect().width;
    const currentTime = x * duration / width;

    onChange(currentTime);
  };

  render() {
    const { isDragging } = this.state;
    const { currentTime, duration, bufferedTime } = this.props;
    const currentPosition = currentTime * 100 / duration;
    const bufferedTimePercentage = bufferedTime * 100 / duration;

    return (
      <TimeLine onClick={this.onNavigate}>
        <BufferedTime style={{ width: `${bufferedTimePercentage}%` }} />
        <CurrentTimeLine style={{ width: `${currentPosition}%` }}>
          <Thumb onMouseDown={this.onThumbMouseDown}>
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
