import * as React from 'react';
import { TimelineEntry as TimelineDataEntry } from '../../../graphs';
import { TimelineEntryPoint } from './styles';

export interface Props {
  selectedColor: string;
  color: string;
  entry: TimelineDataEntry;
  left: number;
}

export default class TimelinePoint extends React.Component<Props, any> {
  defaultProps = {
    startResize: () => {},
  };

  render() {
    const { color, left, entry } = this.props;

    return (
      <TimelineEntryPoint
        color={color}
        style={{
          left: `${left}px`,
        }}
      >
        <div className="point" />
        {/* <input type='text' value={this.props.entry.title} /> */}
        <span>{entry.title}</span>
      </TimelineEntryPoint>
    );
  }
}
