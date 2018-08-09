import * as React from 'react';
import { Component } from 'react';
import { Context } from '@atlaskit/media-core';
import { MediaGridView, GridItem } from './mediaGridView';

export interface PublicGridItem {
  id: string;
  dimensions: {
    width: number;
    height: number;
  };
  collectionName?: string;
}

export interface MediaGridProps {
  context: Context | Promise<Context>;
  items: PublicGridItem[];
  isInteractive?: boolean;
  width?: number;
  itemsPerRow?: number;
}

export type PopulatedItem = PublicGridItem & {
  dataURI?: string;
  isLoaded?: boolean;
};

export interface MediaGridState {
  populatedItems: PopulatedItem[];
}

export const updatePopulatedItems = (
  populatedItems: PopulatedItem[],
  gridItems: GridItem[],
): PopulatedItem[] => {
  const newPopulatedItems: PopulatedItem[] = gridItems.map(gridItem => {
    const populatedItem = populatedItems.find(
      populatedItem => populatedItem.dataURI === gridItem.dataURI,
    );
    const id = populatedItem ? populatedItem.id : '';

    return {
      ...gridItem,
      id,
    };
  });

  return newPopulatedItems;
};

export class MediaGrid extends Component<MediaGridProps, MediaGridState> {
  state: MediaGridState = {
    populatedItems: this.props.items,
  };

  setItemDataURI = async (item: PublicGridItem) => {
    const { context } = this.props;
    const { collectionName, dimensions } = item;
    const dataURI = await (await context).getImageUrl(item.id, {
      collection: collectionName,
      ...dimensions,
    });
    // we want to read the state after we retrieve the dataURI
    const { populatedItems } = this.state;
    const newPopulatedItems: PopulatedItem[] = populatedItems.map(
      populatedItem => {
        if (
          populatedItem.id === item.id &&
          populatedItem.collectionName === item.collectionName
        ) {
          return {
            ...populatedItem,
            dataURI,
          };
        }

        return populatedItem;
      },
    );

    this.setState({
      populatedItems: newPopulatedItems,
    });
  };

  componentWillReceiveProps(newProps: MediaGridProps) {
    const { populatedItems: currentPopulatedItems } = this.state;
    const { items } = newProps;
    const newPopulatedItems: PopulatedItem[] = items.map(newItem => {
      const item = currentPopulatedItems.find(
        item =>
          item.id === newItem.id &&
          item.collectionName === newItem.collectionName,
      );

      if (item) {
        return item;
      }

      return newItem;
    });

    this.setState({
      populatedItems: newPopulatedItems,
    });
  }

  componentDidMount() {
    const { items } = this.props;

    items.forEach(item => {
      this.setItemDataURI(item);
    });
  }

  onItemsChange = (items: GridItem[]) => {
    const { populatedItems } = this.state;
    const newPopulatedItems = updatePopulatedItems(populatedItems, items);

    this.setState({
      populatedItems: newPopulatedItems,
    });
  };

  getGridItems = (): GridItem[] => {
    const { populatedItems } = this.state;

    return populatedItems.map(({ dimensions, dataURI, isLoaded }) => ({
      dimensions,
      dataURI,
      isLoaded,
    }));
  };

  render() {
    const { isInteractive, width, itemsPerRow } = this.props;

    return (
      <MediaGridView
        items={this.getGridItems()}
        onItemsChange={this.onItemsChange}
        isInteractive={isInteractive}
        width={width}
        itemsPerRow={itemsPerRow}
      />
    );
  }
}
