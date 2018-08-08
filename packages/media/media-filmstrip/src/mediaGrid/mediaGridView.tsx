import * as React from 'react';
import { Component } from 'react';
import { Wrapper, RowWrapper, imageMargin, ImgWrapper } from './styled';

export interface GridItem {
  dataURI?: string;
  isLoaded?: boolean;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface MediaGridViewProps {
  items: GridItem[];
  onItemsChange: (items: GridItem[]) => void;
  isInteractive?: boolean;
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
    isInteractive: true,
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
    const { itemsPerRow, items } = this.props;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.pageX - left;
    let dropIndex = index;
    const onTheRightSideOfAnImage = x > width / 2;
    if (onTheRightSideOfAnImage) {
      dropIndex += 1;
    }
    const overLastImageInTheRow = dropIndex % itemsPerRow! === 0;
    const isAbsoluteLastItem = index === items.length - 1;
    const lastInRow =
      (onTheRightSideOfAnImage && overLastImageInTheRow) || isAbsoluteLastItem;
    if (
      this.state.dropIndex !== dropIndex ||
      this.state.lastInRow !== lastInRow
    ) {
      this.setState({ dropIndex, lastInRow });
    }
    event.preventDefault();
  };

  moveImage = () => {
    const { draggingIndex } = this.state;
    const { onItemsChange } = this.props;

    let dropIndex = this.state.dropIndex!;

    const items = [...this.props.items];
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

  onLoad = (dataURI: string) => () => {
    const { items, onItemsChange } = this.props;
    const newItems = items.map(item => ({
      ...item,
      isLoaded: item.dataURI === dataURI || item.isLoaded,
    }));
    onItemsChange(newItems);
  };

  renderImage = (item: GridItem, gridHeight: number, index: number) => {
    const { isInteractive } = this.props;
    const { dimensions, dataURI, isLoaded } = item;
    const { width, height } = dimensions;
    const aspectRatio = width / height;
    const styles = {
      width: gridHeight * aspectRatio,
      height: gridHeight,
    };
    const img = dataURI ? (
      <img
        draggable={isInteractive}
        src={dataURI}
        onLoad={this.onLoad(dataURI)}
        style={styles} // TODO: check if we need this or just use 100%
        alt="image"
        onDragEnd={this.onDragEnd}
        onDragStart={
          isInteractive ? this.onDragStart.bind(this, index) : undefined
        }
        onDragOver={
          isInteractive ? this.onDragOver.bind(this, index) : undefined
        }
      />
    ) : (
      undefined
    );

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
          isLoaded={isLoaded}
          hasPlaceholder={hasPlaceholder}
          isRightPlaceholder={isRightPlaceholder}
        >
          {img}
        </ImgWrapper>
      </React.Fragment>
    );
  };

  preventDefault(event) {
    event.preventDefault();
  }

  render() {
    const { items, itemsPerRow, width } = this.props;
    const rows: JSX.Element[] = [];
    for (let index = 0; index < items.length; index += itemsPerRow!) {
      /*
      # How the image scaling magic works
      hx, wx, aspectx: height, width and aspect ratio of image x (aspect = w/h)
      (hx, wx, aspectx = 0 when < x images on row (numImages))

      All images in row must fit image grid width:
      w1 * scale1 + w2 * scale2 + w3 * scale3 + (numImages-1) * margin = gridWidth

      therefore:
      (h1 * aspect1) * scale1 + (h2 * aspect2) * scale2 + (h3 * aspect3) * scale3 
          = gridWidth - (numImages-1) * margin

      All images in row must be same height
      h1 * scale1 = h2 * scale2 = h3 * scale3 = gridHeight

      -> (h1 * scale1) * aspect1  + (h2 * scale2) * aspect2 + (h3 * scale3) * aspect3
          = gridWidth - (numImages-1) * margin

      -> gridHeight * aspect1 + gridHeight * aspect2 + gridHeight * aspect3
          = gridWidth - (numImages-1) * margin

      -> gridHeight * (aspect1 + aspect2 + aspect3) = gridWidth - (numImages-1) * margin

      -> gridHeight = (gridWidth - (numImages-1) * margin) / (aspect1 + aspect2 + aspect3)
      */
      const itemsInRow = items.slice(index, index + itemsPerRow!);
      const aspectRatioSum = itemsInRow
        .map(i => i.dimensions.width / i.dimensions.height)
        .reduce((prev, curr) => prev + curr, 0);
      const marginSum = (itemsInRow.length - 1) * imageMargin;
      const gridHeight = (width! - marginSum) / aspectRatioSum;

      rows.push(
        <RowWrapper key={'row' + index}>
          {itemsInRow.map((item, columnIndex) =>
            this.renderImage(item, gridHeight, index + columnIndex),
          )}
        </RowWrapper>,
      );
    }
    return <Wrapper>{rows}</Wrapper>;
  }
}
