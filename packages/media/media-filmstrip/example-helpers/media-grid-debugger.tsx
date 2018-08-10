import * as React from 'react';
import { Component } from 'react';
import {
  Debugger,
  DebuggerItem,
  DebuggerPlaceHolder,
  DebuggerRow,
} from './styled';
import {
  DEFAULT_ITEMS_PER_ROW,
  GridItem,
  MediaGridView,
  MediaGridViewState,
} from '../src/mediaGrid/mediaGridView';

export type MediaGridItemWithDebugId = GridItem & {
  debugId: number;
};

export interface MediaGridDebuggerProps {
  items: MediaGridItemWithDebugId[];
  itemsPerRow?: number;
  mediaGridView: MediaGridView;
}

export interface MediaGridDebuggerState {
  mediaGridViewState: MediaGridViewState;
}

export class MediaGridDebugger extends Component<
  MediaGridDebuggerProps,
  MediaGridDebuggerState
> {
  state: MediaGridDebuggerState = {
    mediaGridViewState: {
      isDragging: false,
      draggingIndex: -1,
      selected: -1,
    },
  };

  componentDidUpdate() {
    const { mediaGridView } = this.props;
    if (mediaGridView && !mediaGridView.componentDidUpdate) {
      mediaGridView.componentDidUpdate = () => {
        this.setState({ mediaGridViewState: mediaGridView.state });
      };
    }
  }

  private isEmptyItem = (item: GridItem) => {
    return item.dimensions.width === 0 && item.dimensions.height === 0;
  };

  debugItems() {
    const { items, itemsPerRow = DEFAULT_ITEMS_PER_ROW } = this.props;
    const rows: JSX.Element[] = [];
    const numberOfRows = Math.ceil(items.length / itemsPerRow);
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex += 1) {
      const rowItems = items.slice(
        rowIndex * itemsPerRow,
        rowIndex * itemsPerRow + itemsPerRow,
      );
      rows.push(
        <DebuggerRow key={'row' + rowIndex}>
          {rowItems.map((item, colIndex) => {
            const i = rowIndex * itemsPerRow + colIndex;
            const isEmpty = this.isEmptyItem(item);
            const leftPlaceholder =
              i === this.state.mediaGridViewState.dropIndex ? (
                <DebuggerPlaceHolder />
              ) : null;
            return (
              <React.Fragment key={i}>
                {leftPlaceholder}
                <DebuggerItem
                  isEmpty={isEmpty}
                  isDragged={i === this.state.mediaGridViewState.draggingIndex}
                >
                  {!isEmpty ? (item as any).debugId : null}
                </DebuggerItem>
              </React.Fragment>
            );
          })}
        </DebuggerRow>,
      );
    }
    return rows;
  }

  render() {
    return (
      <Debugger>
        {this.debugItems()}
        <div>Drop Index: {this.state.mediaGridViewState.dropIndex}</div>
        <div>Drag Index: {this.state.mediaGridViewState.draggingIndex}</div>
      </Debugger>
    );
  }
}
