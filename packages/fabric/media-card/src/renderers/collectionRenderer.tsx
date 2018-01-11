import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Subscription } from 'rxjs/Subscription';
import {
  Context,
  MediaCollectionProvider,
  MediaCollection,
  MediaCollectionItem,
} from '@atlaskit/media-core';

import { InfiniteScroll } from '../list/infiniteScroll';

export const DEFAULT_PAGE_SIZE = 30;

const INITIAL_STATE = {
  collection: undefined,
  isLoading: true,
  error: undefined,
  hasNewItems: false,
};

export type CollectionRendererProps = {
  readonly context: Context;
  readonly collectionName: string;
  readonly pageSize?: number;

  readonly useInfiniteScroll?: boolean;
  readonly height?: number;

  readonly children: (state: CollectionRendererState) => ReactNode;
};

export type CollectionRendererState = {
  readonly collection?: MediaCollection;
  readonly isLoading: boolean;
  readonly error?: any;
  readonly hasNewItems: boolean;
};

export class CollectionRenderer extends Component<
  CollectionRendererProps,
  CollectionRendererState
> {
  private collectionProvider: MediaCollectionProvider;
  private subscription: Subscription;

  state: CollectionRendererState = INITIAL_STATE;

  componentWillReceiveProps(
    nextProps: Readonly<CollectionRendererProps>,
    nextContext: any,
  ): void {
    const { context, collectionName, pageSize } = this.props;
    if (
      nextProps.context !== context ||
      nextProps.collectionName !== collectionName ||
      nextProps.pageSize !== pageSize
    ) {
      this.loadCollection(nextProps);
    }
  }

  componentDidMount() {
    this.loadCollection(this.props);
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  render() {
    const { useInfiniteScroll, height } = this.props;
    const children = this.props.children(this.state);

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

  private loadCollection({
    context,
    collectionName,
    pageSize = DEFAULT_PAGE_SIZE,
  }: CollectionRendererProps): void {
    this.unsubscribe();
    this.collectionProvider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );
    this.setState(INITIAL_STATE, () => {
      this.subscription = this.collectionProvider.observable().subscribe({
        next: collection => {
          this.setState(({ collection: previousCollection }, props) => {
            const previousKey = previousCollection
              ? this.getItemKey(previousCollection.items[0])
              : undefined;
            const currentKey = this.getItemKey(collection.items[0]);

            const hasNewItems = previousKey && previousKey !== currentKey;
            return {
              collection,
              isLoading: false,
              hasNewItems,
            };
          });
        },
        error: error => this.setState({ error, isLoading: false }),
      });
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getItemKey({
    details: { id, occurrenceKey },
  }: MediaCollectionItem): string {
    return `${id}-${occurrenceKey}`;
  }
}
