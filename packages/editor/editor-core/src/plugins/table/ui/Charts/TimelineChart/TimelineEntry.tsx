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
  resizing?: boolean;
  startResize?: (
    direction: 'left' | 'right',
    event: React.MouseEvent<HTMLDivElement>,
  ) => void;
}

export default class TimelineEntry extends React.Component<Props, any> {
  defaultProps = {
    startResize: () => {},
  };

  render() {
    const {
      selected,
      resizing,
      selectedColor,
      color,
      left,
      width,
      entry,
    } = this.props;

    return (
      <TimelineEntryContainer
        onClick={this.props.onClick}
        selected={selected}
        resizing={resizing}
        selectedColor={selectedColor}
        color={color}
        style={{
          left: `${left}px`,
          width: `${width}px`,
        }}
        className={`${resizing ? '-resizing' : ''}`}
      >
        <TimelineEntryContent>
          <ResizeButton
            className="ProseMirror-timeline_resize_btn"
            onMouseDown={e => this.handleMouseDown(e, 'left')}
          />
          {/* <input type='text' value={this.props.entry.title} /> */}
          <span>{entry.title}</span>
          <ResizeButton
            className="ProseMirror-timeline_resize_btn"
            onMouseDown={e => this.handleMouseDown(e, 'right')}
          />
        </TimelineEntryContent>
      </TimelineEntryContainer>
    );
  }

  private handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    direction: 'left' | 'right',
  ) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.startResize ? this.props.startResize(direction, event) : null;
  };
}
