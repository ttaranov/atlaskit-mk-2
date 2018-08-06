import * as React from 'react';
import { Component } from 'react';
import {
  Wrapper,
  RowWrapper,
  imageMargin,
  ImgWrapper,
  LeftPlaceholder,
  RightPlaceholder,
} from './styled';

export interface GridItem {
  dataURI: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface MediaGridViewProps {
  items: GridItem[];
  onItemsChange: (items: GridItem[]) => void;
  width?: number;
  itemsPerRow?: number;
}

export interface MediaGridViewState {
  isDragging: boolean;
  draggingIndex: number;
}

const defaultWidth = 744;

export class MediaGridView extends Component<
  MediaGridViewProps,
  MediaGridViewState
> {
  state: MediaGridViewState = {
    isDragging: false,
    draggingIndex: 0,
  };
  static defaultProps: Partial<MediaGridViewProps> = {
    itemsPerRow: 3,
    width: defaultWidth,
  };

  onDropImage = (index: number) => event => {
    event.preventDefault();
    const { draggingIndex } = this.state;
    const { items, onItemsChange } = this.props;

    console.log('onDrop', { index, draggingIndex });
    const oldItem = items[index];
    const newItem = items[draggingIndex];

    items[index] = newItem;
    items[draggingIndex] = oldItem;

    onItemsChange(items);
  };

  renderImage = (item: GridItem, gridHeight: number, index: number) => {
    const { isDragging } = this.state;
    const { width, height } = item.dimensions;
    const aspectRatio = width / height;
    const styles = {
      width: gridHeight * aspectRatio,
      height: gridHeight,
    };
    // (h1 * aspect1) * scale1 + (h2 * aspect2) * scale2 + (h3 * aspect3) * scale3 = gridWidth -  2*margin

    // h1 * scale1 = h2 * scale2 = h3 * scale3 = gridHeight
    // gridHeight = (gridWidth -  2*margin) / (aspect1 +  aspect2 +  aspect3)

    return (
      <ImgWrapper key={index} style={styles}>
        <LeftPlaceholder
          isDragging={isDragging}
          onDragOver={this.onDragOver}
          onDrop={this.onDropImage(index)}
        />
        <img
          draggable={true}
          src={item.dataURI}
          style={styles}
          alt="image"
          onDragStart={this.onDragStart(index)}
        />
        {/* <RightPlaceholder isDragging={isDragging} onDrop={this.onDrop(index + 1)} /> */}
      </ImgWrapper>
    );
  };

  onDragStart = (draggingIndex: number) => () => {
    console.log('onDragStart');
    this.setState({
      isDragging: true,
      draggingIndex,
    });
  };

  onMouseDown = () => {
    this.setState({
      isDragging: true,
    });
  };

  onDrop = event => {
    event.preventDefault();
    console.log('onDrop');
  };

  onDragEnter = () => {
    console.log('onDragEnter');
  };

  onDragOver = event => {
    event.preventDefault();
  };

  render() {
    const { items, width = defaultWidth } = this.props;
    const rows = items.map((item, index) => {
      if (index % 3 === 0) {
        const images = [item, items[index + 1], items[index + 2]].filter(
          i => i,
        );
        const aspectRatioSum = images
          .map(i => i.dimensions.width / i.dimensions.height)
          .reduce((prev, curr) => prev + curr, 0);
        const marginSum = (images.length - 1) * imageMargin;
        const gridHeight = (width - marginSum) / aspectRatioSum;

        return (
          <RowWrapper key={index}>
            {images.map((item, columnIndex) =>
              this.renderImage(item, gridHeight, index + columnIndex),
            )}
          </RowWrapper>
        );
      } else {
        return;
      }
    });
    const styles = { width };

    return (
      <Wrapper
        // onMouseDown={this.onMouseDown}
        style={styles}
      >
        {/* <RightPlaceholder isDragging={true} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter} onDrop={this.onDrop} /> */}
        {rows}
      </Wrapper>
    );
  }
}
