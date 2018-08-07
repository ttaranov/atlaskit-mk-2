import * as React from 'react';
import { Component } from 'react';
import { Wrapper, RowWrapper, imageMargin, ImgWrapper } from './styled';

export interface GridItem {
  dataURI?: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface MediaGridViewProps {
  items: GridItem[];
  onItemsChange: (items: GridItem[]) => void;
  isInteractive?: boolean; // TODO: implement
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
    console.log('reset dragging');
    this.setState({
      dropIndex: undefined,
      isDragging: false,
    });
  };

  onDragOver = (index, event: React.DragEvent<HTMLImageElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.pageX - left;
    let dropIndex = index;
    if (x > width / 2) {
      dropIndex += 1;
    }
    if (this.state.dropIndex !== dropIndex) {
      this.setState({ dropIndex });
    }
    event.preventDefault();
  };

  moveImage = () => {
    console.log('move image');
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

  renderImage = (item: GridItem, gridHeight: number, index: number) => {
    const { dimensions, dataURI } = item;
    const { width, height } = dimensions;
    const aspectRatio = width / height;
    const styles = {
      width: gridHeight * aspectRatio,
      height: gridHeight,
    };
    const img = dataURI ? (
      <img
        draggable={true}
        src={dataURI}
        style={styles} // TODO: check if we need this or just use 100%
        alt="image"
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart.bind(this, index)}
        onDragOver={this.onDragOver.bind(this, index)}
      />
    ) : (
      undefined
    );

    return (
      <React.Fragment key={index}>
        <ImgWrapper
          style={styles}
          hasPlaceholder={this.state.dropIndex === index}
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
    return <Wrapper>{rows}</Wrapper>;
  }
}
