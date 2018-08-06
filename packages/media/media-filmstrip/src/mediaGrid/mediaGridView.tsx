import * as React from 'react';
import { Component } from 'react';

// MediaItem {
//   dataURI: string,
//   dimensions: {
//     width: number,
//     height: number,
//   }
// }

// <MediaGridView

// />

export interface MediaGridViewProps {
  // items: MediaItem[];
  width?: number;
  itemsPerRow?: number;
}

class MediaGridView extends Component<MediaGridViewProps> {
  static defaultProps: Partial<MediaGridViewProps> = {
    itemsPerRow: 3,
  };

  render() {
    return <h1>Hello world</h1>;
  }
}
