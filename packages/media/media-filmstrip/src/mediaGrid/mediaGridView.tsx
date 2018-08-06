import * as React from 'react';
import { Component } from 'react';
import { RowWrapper, imageMargin, Placeholder } from './styled';

export interface GridItem {
  dataURI: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface MediaGridViewProps {
  items: GridItem[];
  width?: number;
  itemsPerRow?: number;
  placeholderPosition?: number;
}

export interface MediaGridViewState {
  // dropIndex?: number;
}

const defaultWidth = 744;

export class MediaGridView extends Component<
  MediaGridViewProps,
  MediaGridViewState
> {
  constructor(props: MediaGridViewProps) {
    super(props);
  }

  static defaultProps: Partial<MediaGridViewProps> = {
    itemsPerRow: 3,
    width: defaultWidth,
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

    let placeholder;
    if (this.props.placeholderPosition === index) {
      placeholder = <Placeholder style={{ height: gridHeight }} />;
    }

    return (
      <React.Fragment key={index}>
        {placeholder}
        <img src={item.dataURI} style={styles} alt="image" />
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
    return <div>{rows}</div>;
  }
}
