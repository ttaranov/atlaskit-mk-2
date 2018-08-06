import * as React from 'react';
import { Component, ChangeEvent } from 'react';
import { MediaGridView, GridItem } from '../src/mediaGrid/mediaGridView';
import { FieldRangeWrapper } from '../example-helpers/styled';

const image1 = {
  dataURI:
    'https://images.unsplash.com/photo-1533468432434-200de3b5d528?ixlib=rb-0.3.5&s=83b6a800c6d49aed6732730b11c8ae72&auto=format&fit=crop&w=975&q=80',
  dimensions: {
    width: 975,
    height: 1301,
  },
};
const image2 = {
  dataURI:
    'https://images.unsplash.com/photo-1533458504656-81a904b29a69?ixlib=rb-0.3.5&s=be9e4317bee4599fc101a2840da3c56a&auto=format&fit=crop&w=2250&q=80',
  dimensions: {
    width: 2250,
    height: 1500,
  },
};
const image3 = {
  dataURI:
    'https://images.unsplash.com/photo-1533396257172-78e7d58da599?ixlib=rb-0.3.5&s=140bed06f491d46adee0d16eebff8fa4&auto=format&fit=crop&w=934&q=80',
  dimensions: {
    width: 934,
    height: 1399,
  },
};
const image4 = {
  dataURI:
    'https://images.unsplash.com/photo-1533475184589-ad2b25374b56?ixlib=rb-0.3.5&s=4fb3ed72b064d35d3ae90f1d5267a723&auto=format&fit=crop&w=2250&q=80',
  dimensions: {
    width: 2250,
    height: 1500,
  },
};
const gridItems: GridItem[] = [
  image1,
  image2,
  image3,
  image4,
  image1,
  image1,
  image1,
  image1,
  image2,
];

interface ExampleState {
  width: number;
  placeholderPosition: number;
  items: GridItem[];
}

class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    placeholderPosition: 1,
    width: 744,
    items: gridItems,
  };

  onWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const width = Number.parseInt(target.value);

    this.setState({ width });
  };

  onPlacehoderPositionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const placeholderPosition = Number.parseInt(target.value);

    this.setState({ placeholderPosition });
  };

  addImage = () => {
    const { items } = this.state;
    const index = Math.floor(Math.random() * gridItems.length);
    const newItem = gridItems[index];

    this.setState({
      items: [newItem, ...items],
    });
  };

  onItemsChange = items => {
    this.setState({ items });
  };

  render() {
    const { width, items, placeholderPosition } = this.state;
    return (
      <div>
        <FieldRangeWrapper>
          <input
            type="range"
            value={width}
            max={window.innerWidth}
            onChange={this.onWidthChange}
          />
          <button onClick={this.addImage}>Add image</button>
        </FieldRangeWrapper>
        <FieldRangeWrapper>
          <input
            type="range"
            value={placeholderPosition}
            min={0}
            max={items.length}
            onChange={this.onPlacehoderPositionChange}
          />
        </FieldRangeWrapper>
        <MediaGridView
          items={items}
          onItemsChange={this.onItemsChange}
          width={width}
          placeholderPosition={placeholderPosition}
        />
      </div>
    );
  }
}

export default () => <Example />;
