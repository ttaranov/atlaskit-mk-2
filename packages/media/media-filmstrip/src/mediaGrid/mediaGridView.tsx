import * as React from 'react';
import { Component } from 'react';
import { RowWrapper, imageMargin } from './styled';

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
}

const defaultWidth = 744;

export class MediaGridView extends Component<MediaGridViewProps> {
  static defaultProps: Partial<MediaGridViewProps> = {
    itemsPerRow: 3,
    width: defaultWidth,
  };

  renderImage = (item: GridItem, gridHeight: number, key: number) => {
    const { width, height } = item.dimensions;
    const aspectRatio = width / height;
    const styles = {
      width: gridHeight * aspectRatio,
      height: gridHeight,
    };
    // (h1 * aspect1) * scale1 + (h2 * aspect2) * scale2 + (h3 * aspect3) * scale3 = gridWidth -  2*margin

    // h1 * scale1 = h2 * scale2 = h3 * scale3 = gridHeight
    // gridHeight = (gridWidth -  2*margin) / (aspect1 +  aspect2 +  aspect3)

    return <img key={key} src={item.dataURI} style={styles} alt="image" />;
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
            {images.map((item, index) =>
              this.renderImage(item, gridHeight, index),
            )}
          </RowWrapper>
        );
      } else {
        return;
      }
    });
    const styles = { width };

    return <div style={styles}>{rows}</div>;
  }
}
