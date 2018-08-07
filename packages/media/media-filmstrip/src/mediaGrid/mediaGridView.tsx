import * as React from 'react';
import { Component } from 'react';
import { Wrapper, RowWrapper, imageMargin, ImgWrapper } from './styled';

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
  // Index of dragged element
  draggingIndex: number;
  // Index where element should end up after drop
  dropIndex?: number;
  // Special flag we need to keep track of. It shows if mouse cursor with dragged item is currently
  // over last item in the row.
  lastInRow?: boolean;
}

const DEFAULT_WIDTH = 744;
const ITEMS_PER_ROW = 3;

export class MediaGridView extends Component<
  MediaGridViewProps,
  MediaGridViewState
> {
  state: MediaGridViewState = {
    isDragging: false,
    draggingIndex: 0,
  };
  static defaultProps: Partial<MediaGridViewProps> = {
    itemsPerRow: ITEMS_PER_ROW,
    width: DEFAULT_WIDTH,
  };

  componentDidMount() {
    document.addEventListener('dragover', this.preventDefault);
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', this.preventDefault);
  }

  onDragStart = (
    draggingIndex: number,
    event: React.DragEvent<HTMLImageElement>,
  ) => {
    event.dataTransfer.effectAllowed = 'move';
    this.setState({
      isDragging: true,
      draggingIndex,
    });
  };

  resetDragging = () => {
    this.setState({
      dropIndex: undefined,
      isDragging: false,
    });
  };

  onDragOver = (index, event: React.DragEvent<HTMLImageElement>) => {
    const { itemsPerRow } = this.props;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.pageX - left;
    let dropIndex = index;
    const onTheRightSideOfAnImage = x > width / 2;
    if (onTheRightSideOfAnImage) {
      dropIndex += 1;
    }
    if (this.state.dropIndex !== dropIndex) {
      const overLastImageInTheRow = dropIndex % itemsPerRow! === 0;
      const lastInRow = onTheRightSideOfAnImage && overLastImageInTheRow;
      this.setState({ dropIndex, lastInRow });
    }
    event.preventDefault();
  };

  moveImage = () => {
    const { draggingIndex } = this.state;
    const { items, onItemsChange } = this.props;

    let dropIndex = this.state.dropIndex!;
    const draggingItem = items.splice(draggingIndex, 1)[0];
    if (dropIndex > draggingIndex) {
      dropIndex -= 1;
    }
    items.splice(dropIndex, 0, draggingItem);
    onItemsChange(items);
  };

  onDragEnd = (event: React.DragEvent<HTMLImageElement>) => {
    if (event.dataTransfer.dropEffect === 'move') {
      this.moveImage();
    }
    this.resetDragging();
  };

  renderImage = (item: GridItem, gridHeight: number, index: number) => {
    const { width, height } = item.dimensions;
    const aspectRatio = width / height;
    const styles = {
      width: gridHeight * aspectRatio,
      height: gridHeight,
    };
    // (h1 * aspect1) * scale1 + (h2 * aspect2) * scale2 + (h3 * aspect3) * scale3 = gridWidth -  2*margin

    // h1 * scale1 = h2 * scale2 = h3 * scale3 = gridHeight
    // gridHeight = (gridWidth -  2*margin) / (aspect1 +  aspect2 +  aspect3)

    let isRightPlaceholder = this.state.lastInRow || false;
    if (this.state.draggingIndex > this.state.dropIndex!) {
      // If image is dragged from "right" to "left" it will end up going as a first image of a
      // next row. So we override placeholder on the right logic and show left placeholder on the
      // next row where image will lang.
      isRightPlaceholder = false;
    }
    const hasPlaceholder =
      index === this.state.dropIndex! - (isRightPlaceholder ? 1 : 0);

    return (
      <React.Fragment key={index}>
        <ImgWrapper
          style={styles}
          hasPlaceholder={hasPlaceholder}
          isRightPlaceholder={isRightPlaceholder}
        >
          <img
            draggable={true}
            src={item.dataURI}
            style={styles}
            alt="image"
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart.bind(this, index)}
            onDragOver={this.onDragOver.bind(this, index)}
          />
        </ImgWrapper>
      </React.Fragment>
    );
  };

  preventDefault(event) {
    event.preventDefault();
  }

  render() {
    const { items, itemsPerRow, width } = this.props;
    const rows = items.map((item, index) => {
      if (index % itemsPerRow! === 0) {
        const images = [item, items[index + 1], items[index + 2]].filter(
          i => i,
        );
        const aspectRatioSum = images
          .map(i => i.dimensions.width / i.dimensions.height)
          .reduce((prev, curr) => prev + curr, 0);
        const marginSum = (images.length - 1) * imageMargin;
        const gridHeight = (width! - marginSum) / aspectRatioSum;

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
    return <Wrapper>{rows}</Wrapper>;
  }
}
