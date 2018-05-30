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
    const { selected } = this.props;

    return (
      <TimelineEntryContainer
        onClick={this.props.onClick}
        selected={selected}
        resizing={this.props.resizing}
        selectedColor={this.props.selectedColor}
        color={this.props.color}
        style={{
          left: `${this.props.left}px`,
          width: `${this.props.width}px`,
        }}
      >
        <TimelineEntryContent>
          {selected ? (
            <ResizeButton onMouseDown={e => this.onMouseDown(e, 'left')} />
          ) : null}
          {/* <input type='text' value={this.props.entry.title} /> */}
          <span>{this.props.entry.title}</span>
          {selected ? (
            <ResizeButton onMouseDown={e => this.onMouseDown(e, 'right')} />
          ) : null}
        </TimelineEntryContent>
      </TimelineEntryContainer>
    );
  }

  onMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    direction: 'left' | 'right',
  ) => {
    // event.preventDefault();
    // event.stopPropagation();

    // this.setState({
    //   resizeDirection: direction
    // });

    // const boundingRect = event.currentTarget.getBoundingClientRect();
    // const x = event.clientX - boundingRect.left;

    // console.log('x was', x, 'left was', this.props.left, 'clientX', boundingRect.left);

    // this.props.startResize!(direction);
    this.props.startResize ? this.props.startResize(direction, event) : null;

    event.preventDefault();
    event.stopPropagation();
  };
}
