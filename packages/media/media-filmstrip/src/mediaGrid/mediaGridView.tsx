import * as React from 'react';
import { Component } from 'react';
import {
  Wrapper,
  RowWrapper,
  imageMargin,
  ImgWrapper,
  Placeholder,
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
  // dropIndex?: number;
}

export interface MediaGridViewState {
  isDragging: boolean;
  draggingIndex: number;
  dropIndex?: number;
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

  onDragStart = (draggingIndex: number) => {
    console.log('onDragStart', draggingIndex);
    this.setState({
      isDragging: true,
      draggingIndex,
    });
  };

  onDragOver = (index, event: React.DragEvent<HTMLDivElement>) => {
    // var dragX = e.originalEvent.pageX, dragY = e.originalEvent.pageY;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.pageX - left;
    let dropIndex = index;
    if (x > width / 2) {
      dropIndex += 1;
    }
    this.setState({ dropIndex });
    event.preventDefault();
  };

  onDropImage = event => {
    event.preventDefault();
    const { draggingIndex } = this.state;
    const { items, onItemsChange } = this.props;

    const index = this.state.dropIndex!;
    console.log('onDrop', { index, draggingIndex });
    const oldItem = items[index];
    const newItem = items[draggingIndex];

    items[index] = newItem;
    items[draggingIndex] = oldItem;

    this.setState({ dropIndex: undefined, isDragging: false });

    onItemsChange(items);
  };

  renderImage = (item: GridItem, gridHeight: number, index: number) => {
    // const { isDragging } = this.state;
    const { width, height } = item.dimensions;
    const aspectRatio = width / height;
    const styles = {
      width: gridHeight * aspectRatio,
      height: gridHeight,
    };
    // (h1 * aspect1) * scale1 + (h2 * aspect2) * scale2 + (h3 * aspect3) * scale3 = gridWidth -  2*margin

    // h1 * scale1 = h2 * scale2 = h3 * scale3 = gridHeight
    // gridHeight = (gridWidth -  2*margin) / (aspect1 +  aspect2 +  aspect3)

    let placeholder;
    if (this.state.dropIndex === index) {
      placeholder = <Placeholder style={{ height: gridHeight }} />;
    }

    return (
      <React.Fragment key={index}>
        {placeholder}
        <ImgWrapper style={styles}>
          <img
            draggable={true}
            src={item.dataURI}
            style={styles}
            alt="image"
            onDragStart={this.onDragStart.bind(this, index)}
            onDragOver={this.onDragOver.bind(this, index)}
          />
        </ImgWrapper>
      </React.Fragment>
    );
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
          <RowWrapper key={'row' + index}>
            {images.map((item, columnIndex) =>
              this.renderImage(item, gridHeight, index + columnIndex),
            )}
          </RowWrapper>
        );
      } else {
        return;
      }
    });
    return (
      <Wrapper
        onDrop={this.onDropImage}
        onDragOver={event => {
          // do not delete. I am important
          event.preventDefault();
        }}
      >
        {rows}
      </Wrapper>
    );
  }
}
