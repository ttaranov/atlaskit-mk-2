import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Subscription } from 'rxjs/Subscription';
import {
  Context,
  MediaCollectionProvider,
  MediaCollection,
} from '@atlaskit/media-core';

import { InfiniteScroll } from '../list/infiniteScroll';

export const DEFAULT_PAGE_SIZE = 30;

const INITIAL_STATE = {
  collection: undefined,
  isLoading: true,
};

export type CollectionRendererProps = {
  readonly context: Context;
  readonly collectionName: string;
  readonly pageSize?: number;

  readonly useInfiniteScroll?: boolean;
  readonly height?: number;

  readonly children: (
    props: { collection?: MediaCollection; isLoading: boolean },
  ) => ReactNode;
};

export type CollectionRendererState = {
  readonly collection?: MediaCollection;
  readonly isLoading: boolean;
};

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
    this.loadCollection(nextProps);
  }

  componentDidMount() {
    this.loadCollection(this.props);
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  render() {
    const { useInfiniteScroll, height } = this.props;
    const { collection, isLoading } = this.state;
    const children = this.props.children({
      collection,
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
          this.setState({
            collection,
            isLoading: false,
          });
        },
      });
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
