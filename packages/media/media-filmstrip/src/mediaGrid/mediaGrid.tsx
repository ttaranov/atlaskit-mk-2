import * as React from 'react';
import { Component } from 'react';
import { Context } from '@atlaskit/media-core';
import { MediaGridView } from './mediaGridView';

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

  // TODO: handle new props
  componentWillReceiveProps() {}

  componentDidMount() {
    const { items } = this.props;

    items.forEach(item => {
      this.setItemDataURI(item);
    });
  }

  // TODO: update state keeping dataURI's
  onItemsChange = items => {};

  render() {
    const { populatedItems } = this.state;
    // TODO: remove id's
    return (
      <MediaGridView
        items={populatedItems}
        onItemsChange={this.onItemsChange}
      />
    );
  }
}
