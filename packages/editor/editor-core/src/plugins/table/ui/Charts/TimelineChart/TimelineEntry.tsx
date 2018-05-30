import * as React from 'react';
import { TimelineEntry as TimelineDataEntry } from '../../../graphs';
import {
  TimelineEntryContainer,
  ResizeButton,
  TimelineEntryContent,
} from './styles';

export interface Props {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  selectedColor: string;
  color: string;
  entry: TimelineDataEntry;
  left: number;
  width: number;
  selected: boolean;
}

export default class TimelineEntry extends React.Component<Props, any> {
  render() {
    const { selected } = this.props;

    return (
      <TimelineEntryContainer
        onClick={this.props.onClick}
        selected={selected}
        selectedColor={this.props.selectedColor}
        color={this.props.color}
        style={{
          left: `${this.props.left}px`,
          width: `${this.props.width}px`,
        }}
      >
        <TimelineEntryContent>
          {selected ? (
            <ResizeButton
              direction="left"
              color={this.props.selectedColor}
              selectedColor={this.props.color}
            />
          ) : null}
          {/* <input type='text' value={this.props.entry.title} /> */}
          <span>{this.props.entry.title}</span>
          {selected ? (
            <ResizeButton
              direction="right"
              color={this.props.selectedColor}
              selectedColor={this.props.color}
            />
          ) : null}
        </TimelineEntryContent>
      </TimelineEntryContainer>
    );
  }
}
