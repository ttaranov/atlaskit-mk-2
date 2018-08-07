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
  context: Context;
  items: PublicGridItem[];
}

export type PopulatedItem = PublicGridItem & {
  dataURI?: string;
};

export interface MediaGridState {
  populatedItems: PopulatedItem[];
}

export class MediaGrid extends Component<MediaGridProps, MediaGridState> {
  state: MediaGridState = {
    populatedItems: this.props.items,
  };

  setItemDataURI = async (item: PublicGridItem) => {
    const { context } = this.props;
    const { collectionName, dimensions } = item;
    const dataURI = await context.getImageUrl(item.id, {
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
    const newPopulatedItems: PopulatedItem[] = items.map(gridItem => {
      const populatedItem = populatedItems.find(
        populatedItem => populatedItem.dataURI === gridItem.dataURI,
      );
      const id = populatedItem ? populatedItem.id : '';
      if (!id) {
        console.error('no id for', gridItem);
      }

      return {
        ...gridItem,
        id,
      };
    });

    this.setState({
      populatedItems: newPopulatedItems,
    });
  };

  render() {
    const { populatedItems } = this.state;
    return (
      <MediaGridView
        items={populatedItems.map(populatedItem => ({
          ...populatedItem,
          id: undefined,
        }))}
        onItemsChange={this.onItemsChange}
      />
    );
  }
}
