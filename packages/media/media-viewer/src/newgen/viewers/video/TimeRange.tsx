import * as React from 'react';
import { Component } from 'react';
import { TimeLine, CurrentTimeLine, Thumb, BufferedTime } from './styled';

export interface TimeRangeProps {
  currentTime: number;
  bufferedTime: number;
  duration: number;
  onChange: (newTime: number) => void;
}

export interface TimeRangeState {}

export class TimeRange extends Component<TimeRangeProps, TimeRangeState> {
  render() {
    const { currentTime, duration, bufferedTime } = this.props;
    const currentPosition = currentTime * 100 / duration;
    const bufferedTimePercentage = bufferedTime * 100 / duration;
    // duration - 100
    // currentTime - X

    // currentTime * 100 / duration

    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          currentTime: {currentTime} | duration {duration} | bufferedTime{' '}
          {bufferedTime} | currentPosition: {currentPosition}
        </div>
        <TimeLine>
          <BufferedTime style={{ width: `${bufferedTimePercentage}%` }} />
          <CurrentTimeLine style={{ width: `${currentPosition}%` }}>
            <Thumb />
          </CurrentTimeLine>
        </TimeLine>
      </div>
    );
  }
}
