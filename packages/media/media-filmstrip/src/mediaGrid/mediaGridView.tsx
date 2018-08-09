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

export const DEFAULT_WIDTH = 744;
export const DEFAULT_ITEMS_PER_ROW = 3;

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
    draggingIndex: -1,
  };

  static defaultProps: Partial<MediaGridViewProps> = {
    itemsPerRow: DEFAULT_ITEMS_PER_ROW,
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
    const { key } = event;
    const { isInteractive } = this.props;
    const { selected } = this.state;

    if (isInteractive && key === 'Backspace' && selected !== -1) {
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
      draggingIndex: -1,
      isDragging: false,
    });
  };

  onDragOver = (index, event: React.DragEvent<HTMLImageElement>) => {
    const { items, itemsPerRow = DEFAULT_ITEMS_PER_ROW } = this.props;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.pageX - left;
    let dropIndex = index;
    const onTheRightSideOfAnImage = x > width / 2;
    if (onTheRightSideOfAnImage) {
      dropIndex += 1;
    }
    const dropRowIndex = this.dropRowIndex();
    const itemsOnDropRow = this.nonEmptyItemsOnRow(dropRowIndex, items).length;
    const indexOnDropRow = dropIndex - dropRowIndex * itemsPerRow;
    const overLastImageInTheRow = indexOnDropRow % itemsOnDropRow === 0;

    const isAbsoluteLastItem = index === items.length - 1;
    const lastInRow =
      (onTheRightSideOfAnImage && overLastImageInTheRow) ||
      (isAbsoluteLastItem && onTheRightSideOfAnImage);
    // console.log({indexOnDropRow, lastInRow, isAbsoluteLastItem, onTheRightSideOfAnImage});
    if (
      this.state.dropIndex !== dropIndex ||
      this.state.lastInRow !== lastInRow
    ) {
      this.setState({ dropIndex, lastInRow });
    }
    event.preventDefault();
  };

  dropRowIndex() {
    const { draggingIndex, dropIndex = -1 } = this.state;
    const { itemsPerRow = DEFAULT_ITEMS_PER_ROW } = this.props;
    const leftToRight = dropIndex! > draggingIndex;
    return Math.floor((leftToRight ? dropIndex - 1 : dropIndex) / itemsPerRow);
  }

  moveImage = () => {
    const { draggingIndex, selected } = this.state;
    const { itemsPerRow = DEFAULT_ITEMS_PER_ROW } = this.props;
    const items = [...this.props.items];

    let dropIndex = this.state.dropIndex!;

    // Step 1. Take item out
    const draggingItem = items.splice(draggingIndex, 1)[0];
    const draggingItemRow = Math.floor(draggingIndex / itemsPerRow);
    const leftToRight = dropIndex > draggingIndex;
    const dropRow = this.dropRowIndex();
    const rowInplaceSwap = draggingItemRow === dropRow && leftToRight;
    if (rowInplaceSwap) {
      dropIndex -= 1;
    } else {
      // Step 1.5. Replace taken item with empty
      items.splice(draggingIndex, 0, EMPTY_GRID_ITEM);
    }

    // Step 2. Put in a proper place
    items.splice(dropIndex, 0, draggingItem);

    // Step 3. Find next empty item and delete it.
    if (!rowInplaceSwap) {
      let emptyItemToDeleteIndex = -1;
      items.forEach((item, index) => {
        if (
          emptyItemToDeleteIndex < 0 &&
          this.isEmptyItem(item) &&
          index > dropIndex
        ) {
          emptyItemToDeleteIndex = index;
        }
      });
      if (emptyItemToDeleteIndex >= 0) {
        items.splice(emptyItemToDeleteIndex, 1);
      }
    }

    this.normalizeAndReportChange(items);

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
  };

  onDragEnd = (event: React.DragEvent<HTMLImageElement>) => {
    if (event.dataTransfer.dropEffect === 'move') {
      this.moveImage();
    }
    this.resetDragging();
  };

  selectImage = (index: number) => () => {
    this.setState({
      selected: index,
    });
  };

  onLoad = (dataURI: string) => () => {
    const { items } = this.props;
    const newItems = items.map(item => ({
      ...item,
      isLoaded: item.dataURI === dataURI || item.isLoaded,
    }));
    this.normalizeAndReportChange(newItems);
  };

  onRemoveIconClick = (index: number) => () => this.deleteImage(index);

  renderRemoveIcon = (index: number) => {
    const { isInteractive } = this.props;
    if (!isInteractive) {
      return;
    }

    return (
      <RemoveIconWrapper
        className="remove-img-wrapper"
        onClick={this.onRemoveIconClick(index)}
      >
        <Button
          appearance="subtle"
          iconBefore={<CrossIcon label="remove" size="small" />}
        />
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
          onClick={this.selectImage(index)}
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

    // if (this.state.draggingIndex > this.state.dropIndex!) {
    //   // If image is dragged from "right" to "left" it will end up going as a first image of a
    //   // next row. So we override placeholder on the right logic and show left placeholder on the
    //   // next row where image will lang.
    //   isRightPlaceholder = false;
    // }
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

  private nonEmptyItemsOnRow(rowIndex: number, items: GridItem[]) {
    const { itemsPerRow = DEFAULT_ITEMS_PER_ROW } = this.props;
    const rowStartIndex = rowIndex * itemsPerRow;
    return items
      .slice(rowStartIndex, rowStartIndex + itemsPerRow)
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
    const { selected } = this.state;

    if (selected !== -1) {
      if (index < selected) {
        this.setState({ selected: selected - 1 });
      }
    }

    const items = [...this.props.items];
    items[index] = EMPTY_GRID_ITEM;

    this.normalizeAndReportChange(items);
  };

  private getItemsInRows(items: GridItem[]) {
    const { itemsPerRow = DEFAULT_ITEMS_PER_ROW } = this.props;
    const itemsInRows: GridItem[][] = [];
    const numberOfRows = Math.ceil(items.length / itemsPerRow);
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex += 1) {
      itemsInRows.push(
        items.slice(
          rowIndex * itemsPerRow,
          rowIndex * itemsPerRow + itemsPerRow,
        ),
      );
    }

    return itemsInRows;
  }

  normalizeAndReportChange(items: GridItem[]) {
    const { onItemsChange } = this.props;

    const { itemsPerRow = DEFAULT_ITEMS_PER_ROW } = this.props;

    const itemsInRows = this.getItemsInRows(items);
    const itemsInNonEmptyRows = itemsInRows.filter(
      items => items.filter(this.isNotEmptyItem).length > 0,
    );

    const resultItems = itemsInNonEmptyRows
      .map((items, rowIndex) => {
        const nonEmptyItems = items.filter(this.isNotEmptyItem);
        const isLastRow = rowIndex === itemsInNonEmptyRows.length - 1;
        const mightNeedReshuffle = nonEmptyItems.length < itemsPerRow;
        if (isLastRow || !mightNeedReshuffle) {
          return nonEmptyItems;
        } else if (mightNeedReshuffle) {
          let remainingEmptyItems = new Array(
            itemsPerRow - nonEmptyItems.length,
          ).fill(EMPTY_GRID_ITEM);
          return [...nonEmptyItems, ...remainingEmptyItems];
        }
      })
      .reduce<GridItem[]>((accumulator, rowWithItems: GridItem[]) => {
        accumulator.push(...rowWithItems);
        return accumulator;
      }, []);

    onItemsChange(resultItems);
  }

  saveWrapperRef = (ref?: HTMLElement) => {
    if (ref) {
      this.wrapperElement = ref;
    }
  };

  private isEmptyItem = (item: GridItem) => {
    return item.dimensions.width === 0 && item.dimensions.height === 0;
  };

  private isNotEmptyItem = (item: GridItem) => {
    return !this.isEmptyItem(item);
  };

  /**
   * # How the image scaling magic works
   * hx, wx, aspectx: height, width and aspect ratio of image x (aspect = w/h)
   * (hx, wx, aspectx = 0 when < x images on row (numImages))
   *
   * All images in row must fit image grid width:
   * w1 * scale1 + w2 * scale2 + w3 * scale3 + (numImages-1) * margin = gridWidth
   *
   * therefore:
   * (h1 * aspect1) * scale1 + (h2 * aspect2) * scale2 + (h3 * aspect3) * scale3
   * = gridWidth - (numImages-1) * margin
   *
   * All images in row must be same height
   * h1 * scale1 = h2 * scale2 = h3 * scale3 = gridHeight
   *
   * -> (h1 * scale1) * aspect1  + (h2 * scale2) * aspect2 + (h3 * scale3) * aspect3
   * = gridWidth - (numImages-1) * margin
   *
   * -> gridHeight * aspect1 + gridHeight * aspect2 + gridHeight * aspect3
   * = gridWidth - (numImages-1) * margin
   *
   * -> gridHeight * (aspect1 + aspect2 + aspect3) = gridWidth - (numImages-1) * margin
   *
   * -> gridHeight = (gridWidth - (numImages-1) * margin) / (aspect1 + aspect2 + aspect3)
   */
  calculateRowHeight(rowItems: GridItem[], margin: number, rowWidth: number) {
    const aspectRatioSum = rowItems
      .map(i => i.dimensions.width / i.dimensions.height)
      .reduce((prev, curr) => prev + curr, 0);
    const marginSum = (rowItems.length - 1) * imageMargin;
    return (rowWidth - marginSum) / aspectRatioSum;
  }

  render() {
    const {
      items,
      itemsPerRow = DEFAULT_ITEMS_PER_ROW,
      width = DEFAULT_WIDTH,
    } = this.props;
    const rows: JSX.Element[] = [];
    const numberOfRows = Math.ceil(items.length / itemsPerRow);
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex += 1) {
      const itemsInRow = this.nonEmptyItemsOnRow(rowIndex, items);
      const gridHeight = this.calculateRowHeight(
        itemsInRow,
        imageMargin,
        width,
      );

      rows.push(
        <RowWrapper key={'row' + rowIndex}>
          {itemsInRow.map((item, columnIndex) => {
            const index = rowIndex * itemsPerRow + columnIndex;
            return this.renderImage(item, gridHeight, index);
          })}
        </RowWrapper>,
      );
    }
    return (
      <React.Fragment>
        <Wrapper innerRef={this.saveWrapperRef}>{rows}</Wrapper>
      </React.Fragment>
    );
  }
}
