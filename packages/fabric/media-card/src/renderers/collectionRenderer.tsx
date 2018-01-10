import { format as formatBytes } from 'bytes';
import * as dateFormat from 'dateformat';
import * as React from 'react';
import { ReactElement, Component, ReactNode } from 'react';
import { Subscription } from 'rxjs/Subscription';
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

export const DEFAULT_PAGE_SIZE = 30;

const INITIAL_STATE = {
  items: [],
  isLoading: true,
};

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
  readonly pageSize?: number;

  readonly useInfiniteScroll?: boolean;
  readonly height?: number;

  readonly children: (
    props: { items: CollectionItem[]; isLoading: boolean },
  ) => ReactNode;
};

export type CollectionRendererState = {
  readonly items: CollectionItem[];
  readonly isLoading: boolean;
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
  private collectionProvider: MediaCollectionProvider;
  private subscription: Subscription;

  constructor(props: CollectionRendererProps) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentWillReceiveProps(
    nextProps: Readonly<CollectionRendererProps>,
    nextContext: any,
  ): void {
    console.log('componentWillReceiveProps', this.shouldUpdateState(nextProps));
    if (this.shouldUpdateState(nextProps)) {
      this.setState(INITIAL_STATE);
      this.subscribeCollection(nextProps);
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.subscribeCollection(this.props);
  }

  componentWillUnmount(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  private shouldUpdateState(nextProps: CollectionRendererProps): boolean {
    return (
      nextProps.collectionName !== this.props.collectionName ||
      nextProps.context !== this.props.context ||
      nextProps.pageSize !== this.props.pageSize
    );
  }

  private subscribeCollection({
    context,
    collectionName,
    pageSize = DEFAULT_PAGE_SIZE,
  }: CollectionRendererProps): void {
    console.log('subscribeCollection:', collectionName, pageSize);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.collectionProvider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );
    this.subscription = this.collectionProvider.observable().subscribe({
      next: ({ items: recentItems }) => {
        // const {} = this.state;
        const newItemsLength = recentItems.length - this.state.items.length;
        // const foo = recentItems.slice(-newItemsLength);
        console.log(recentItems.slice(-newItemsLength), newItemsLength);
        const items = recentItems
          .slice(this.state.items.length, pageSize)
          .map(item => {
            const { type, insertedAt, details } = item;
            const id = details.id!;
            const mediaType = details.mediaType!;
            const mediaItem: FileItem = { type: 'file', details: { id } };

            // context
            //   .getDataUriService(collectionName)
            //   .fetchImageDataUri(mediaItem, {
            //     width: 640,
            //     height: 480,
            //     // allowAnimated
            //   })
            //   .then(dataUri => {
            //     const { items } = this.state;
            //     const item = items.filter(item => item.id === id)[0];

            //     if (item) {
            //       item.thumbnailSrc = dataUri;
            //       console.log('dataUri: setState')
            //       this.setState({ items });
            //     }
            //   });

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

        console.log('subScribeCollection: setState:', items.length);
        this.setState({ items, isLoading: false });
      },
    });
  }
}
