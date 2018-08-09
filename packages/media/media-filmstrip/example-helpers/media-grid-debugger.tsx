import * as React from 'react';
import { Component } from 'react';
import { Debugger, DebuggerItem, DebuggerRow } from './styled';
import {
  DEFAULT_ITEMS_PER_ROW,
  GridItem,
} from '../src/mediaGrid/mediaGridView';

export type MediaGridItemWithDebugId = GridItem & {
  debugId: number;
};

export interface MediaGridDebuggerProps {
  items: MediaGridItemWithDebugId[];
  itemsPerRow?: number;
}

export class MediaGridDebugger extends Component<MediaGridDebuggerProps> {
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
            return (
              <DebuggerItem key={i} isEmpty={isEmpty}>
                {!isEmpty ? (item as any).debugId : null}
              </DebuggerItem>
            );
          })}
        </DebuggerRow>,
      );
    }
    return rows;
  }

  render() {
    return <Debugger>{this.debugItems()}</Debugger>;
  }
}
