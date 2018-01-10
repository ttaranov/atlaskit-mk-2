import { format as formatBytes } from 'bytes';
import * as dateFormat from 'dateformat';
import * as React from 'react';
import { ReactElement, Component, ReactNode } from 'react';
import ImageIcon from '@atlaskit/icon/glyph/image';
import {
  Context,
  FileItem,
  MediaCollectionItem,
  MediaCollectionFileItem,
  MediaCollectionProvider,
  MediaType,
  MediaItemType,
} from '@atlaskit/media-core';

import { InfiniteScroll } from '../list/infiniteScroll';

export type CollectionItem = {
  readonly id: string;
  readonly occurrenceKey: string;
  readonly type: MediaItemType;

  thumbnailSrc?: string;
  readonly fileName: string; // TODO: actually this should be renamed to support links
  readonly mediaType: MediaType;
  readonly timestamp: number;
  readonly size: number;
  readonly progress: number;
  readonly isSelected: boolean;
};

export type CollectionRendererProps = {
  readonly context: Context;
  readonly collectionName: string;

  readonly useInfiniteScroll?: boolean;
  readonly height?: number;

  readonly children: (
    props: { items: CollectionItem[]; isLoading: boolean },
  ) => ReactNode;
};

export type CollectionRendererState = {
  items: CollectionItem[];
  isLoading: boolean;
};

function isMediaCollectionFileItem(
  item: MediaCollectionItem,
): item is MediaCollectionFileItem {
  return item.type === 'file';
}

export class CollectionRenderer extends Component<
  CollectionRendererProps,
  CollectionRendererState
> {
  private readonly collectionProvider: MediaCollectionProvider;

  constructor(props: CollectionRendererProps) {
    super(props);

    const { context, collectionName } = props;

    this.collectionProvider = context.getMediaCollectionProvider(
      collectionName,
      30,
    );
  }

  state: CollectionRendererState = {
    items: [],
    isLoading: true,
  };

  componentDidMount() {
    const { collectionName, context } = this.props;

    this.collectionProvider.observable().subscribe({
      next: ({ items: recentItems }) => {
        const items = recentItems
          .filter(isMediaCollectionFileItem)
          .map(item => {
            const { type, insertedAt, details } = item;
            const id = details.id!;
            const mediaType = details.mediaType!;
            const mediaItem: FileItem = { type: 'file', details: { id } };

            context
              .getDataUriService(collectionName)
              .fetchImageDataUri(mediaItem, {
                width: 640,
                height: 480,
                // allowAnimated
              })
              .then(dataUri => {
                const { items } = this.state;
                const item = items.filter(item => item.id === id)[0];

                item.thumbnailSrc = dataUri;

                this.setState({ items });
              });

            return {
              id,
              occurrenceKey: details.occurrenceKey,
              type,
              fileName: details.name!,
              mediaType,
              timestamp: insertedAt,
              size: details.size!,
              progress: 1.0,
              isSelected: false,
            };
          });

        this.setState({ items, isLoading: false });
      },
    });
  }

  render() {
    const { useInfiniteScroll, height } = this.props;
    const { items, isLoading } = this.state;
    const children = this.props.children({
      items,
      isLoading,
    });

    if (useInfiniteScroll) {
      return (
        <InfiniteScroll
          height={height}
          onThresholdReached={this.onThresholdReached}
        >
          {children}
        </InfiniteScroll>
      );
    } else {
      return <div>{children}</div>;
    }
  }

  private readonly onThresholdReached = () => {
    this.collectionProvider.loadNextPage();
  };
}
