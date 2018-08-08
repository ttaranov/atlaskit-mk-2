import * as React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Button from '@atlaskit/button';
import {
  Wrapper,
  RowWrapper,
  imageMargin,
  ImgWrapper,
  Img,
  RemoveIconWrapper,
} from './styled';

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
  // Selected image (eg. to be deleted with Delete key)
  selected: number;
}

const DEFAULT_WIDTH = 744;
const ITEMS_PER_ROW = 3;

export const EMPTY_GRID_ITEM: GridItem = {
  dimensions: {
    height: 0,
    width: 0,
  },
};

export class MediaGridView extends Component<
  MediaGridViewProps,
  MediaGridViewState
> {
  wrapperElement?: HTMLElement;

  state: MediaGridViewState = {
    selected: -1,
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
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', this.preventDefault);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('click', this.onDocumentClick);
  }

  onKeyDown = (event: KeyboardEvent) => {
    const { keyCode } = event;
    const { isInteractive } = this.props;
    const { selected } = this.state;

    if (isInteractive && keyCode === 8 && selected !== -1) {
      this.deleteImage(selected);
      this.setState({
        selected: Math.max(selected - 1, -1),
      });
    }
  };

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
    const { draggingIndex, selected } = this.state;
    const { onItemsChange } = this.props;
    const items = [...this.props.items];

    let dropIndex = this.state.dropIndex!;

    const draggingItem = items.splice(draggingIndex, 1)[0];
    if (dropIndex > draggingIndex) {
      dropIndex -= 1;
    }

    // If we are dragging across the selected image, we need to increment
    // or decrement the selected image index
    if (selected !== -1) {
      let newSelected = selected;
      if (draggingIndex < selected && dropIndex > selected) {
        newSelected -= 1;
      } else if (dropIndex < selected && draggingIndex > selected) {
        newSelected += 1;
      }
      this.setState({ selected: newSelected });
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

  onClick = (index: number) => () => {
    this.setState({
      selected: index,
    });
  };

  onLoad = (dataURI: string) => () => {
    const { items, onItemsChange } = this.props;
    const newItems = items.map(item => ({
      ...item,
      isLoaded: item.dataURI === dataURI || item.isLoaded,
    }));
    onItemsChange(newItems);
  };

  onRemoveIconClick = (index: number) => () => this.deleteImage(index);

  renderRemoveIcon = (index: number) => {
    const { isInteractive } = this.props;
    if (!isInteractive) {
      return;
    }

    // TODO: Should we wrapp icon into a ak button?
    return (
      <RemoveIconWrapper
        className="remove-img-wrapper"
        onClick={this.onRemoveIconClick(index)}
      >
        <Button appearance="subtle" iconBefore={<CrossIcon label="remove" />} />
      </RemoveIconWrapper>
    );
  };

  renderImage = (item: GridItem, gridHeight: number, index: number) => {
    const { isInteractive } = this.props;
    const { dimensions, dataURI, isLoaded } = item;
    const { width, height } = dimensions;
    const aspectRatio = width / height;
    const img = dataURI ? (
      <React.Fragment>
        <Img
          isSelected={this.state.selected === index}
          onClick={this.onClick(index)}
          draggable={isInteractive}
          src={dataURI}
          onLoad={this.onLoad(dataURI)}
          alt="image"
          onDragEnd={this.onDragEnd}
          onDragStart={
            isInteractive ? this.onDragStart.bind(this, index) : undefined
          }
          onDragOver={
            isInteractive ? this.onDragOver.bind(this, index) : undefined
          }
        />
        {this.renderRemoveIcon(index)}
      </React.Fragment>
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

    const wrapperStyles = {
      width: gridHeight * aspectRatio,
      height: gridHeight,
    };

    return (
      <React.Fragment key={index}>
        <ImgWrapper
          style={wrapperStyles}
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

  private nonEmptyItemsOnRow(rowIndex: number) {
    const { items, itemsPerRow } = this.props;
    const rowStartIndex = rowIndex * itemsPerRow!;
    return items
      .slice(rowStartIndex, rowStartIndex + itemsPerRow!)
      .filter(item => !!item.dataURI);
  }

  // we want to remove the selected image if the Grid loses the focus
  onDocumentClick = event => {
    const { wrapperElement } = this;
    const { selected } = this.state;

    if (
      wrapperElement &&
      !wrapperElement.contains(event.target) &&
      selected !== -1
    ) {
      this.setState({
        selected: -1,
      });
    }
  };

  deleteImage = (index: number) => {
    const { onItemsChange, itemsPerRow } = this.props;
    const { selected } = this.state;

    if (selected !== -1) {
      if (index < selected) {
        this.setState({ selected: selected - 1 });
      }
    }

    const items = [...this.props.items];
    const rowIndex = Math.floor(index / itemsPerRow!);
    const itemsOnThisRow = this.nonEmptyItemsOnRow(rowIndex);
    if (itemsOnThisRow.length > 1) {
      items[index] = EMPTY_GRID_ITEM;
    } else {
      items.splice(rowIndex * itemsPerRow!, itemsPerRow!);
    }

    onItemsChange(items);
  };

  saveWrapperRef = (ref?: HTMLElement) => {
    if (ref) {
      this.wrapperElement = ref;
    }
  };

  render() {
    const { items, itemsPerRow, width } = this.props;
    const rows: JSX.Element[] = [];
    const numberOfRows = Math.ceil(items.length / itemsPerRow!);
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex += 1) {
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

      const itemsInRow = this.nonEmptyItemsOnRow(rowIndex);
      const aspectRatioSum = itemsInRow
        .map(i => i.dimensions.width / i.dimensions.height)
        .reduce((prev, curr) => prev + curr, 0);
      const marginSum = (itemsInRow.length - 1) * imageMargin;
      const gridHeight = (width! - marginSum) / aspectRatioSum;

      rows.push(
        <RowWrapper key={'row' + rowIndex}>
          {itemsInRow.map((item, columnIndex) => {
            const index = rowIndex * itemsPerRow! + columnIndex;
            return this.renderImage(item, gridHeight, index);
          })}
        </RowWrapper>,
      );
    }
    return <Wrapper innerRef={this.saveWrapperRef}>{rows}</Wrapper>;
  }
}
