/* tslint:disable:variable-name */
import * as React from 'react';
import { Component } from 'react';
import { Subscription } from 'rxjs/Subscription';
import {
  MediaCollection,
  MediaCollectionItem,
  Context,
  isError,
  isCollectionNotFoundError,
} from '@atlaskit/media-core';
import { InfiniteScroll } from '@atlaskit/media-ui';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {
  defaultImageCardDimensions,
  defaultSmallCardDimensions,
} from '../utils';
import { CardDimensions, CardListEvent, CardEvent } from '..';
import { Card, FileIdentifier } from '../root';
import { CollectionAction } from '../actions';
import { CardListItemWrapper, Spinner } from './styled';

export interface CardListProps {
  context: Context;
  collectionName: string;

  height?: number;
  pageSize?: number;

  cardDimensions?: CardDimensions;
  cardAppearance?: 'small' | 'image';

  onCardClick?: (result: CardListEvent) => void;
  actions?: Array<CollectionAction>;

  /**
   * Infinite scrolling is only enabled when height has also been specified.
   */
  useInfiniteScroll?: boolean;
  shouldLazyLoadCards?: boolean;
  errorComponent?: JSX.Element;
  loadingComponent?: JSX.Element;
  emptyComponent?: JSX.Element;
}

export interface CardListState {
  loading: boolean;
  shouldAnimate: boolean;
  firstItemKey?: string;
  subscription?: Subscription;
  loadNextPage?: () => void;
  collection?: MediaCollection;
  error?: Error;
}

const LoadingComponent = (
  <Spinner className="spinner" style={{ width: '100%', height: '100%' }}>
    loading...
  </Spinner>
);
const EmptyComponent = <div>No items</div>;
const ErrorComponent = <div>ERROR</div>;

export class CardList extends Component<CardListProps, CardListState> {
  static defaultPageSize = 10;

  static defaultProps = {
    cardAppearance: 'image',
    pageSize: CardList.defaultPageSize,
    actions: [],
    useInfiniteScroll: true,
    shouldLazyLoadCards: true,
    errorComponent: ErrorComponent,
    loadingComponent: LoadingComponent,
    emptyComponent: EmptyComponent,
  };

  state: CardListState = {
    loading: true,
    shouldAnimate: false,
  };

  private unsubscribe() {
    const { subscription } = this.state;
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  handleNextItems() {
    return (value: MediaCollection | Error) => {
      if (isError(value)) {
        this.setState({ collection: undefined, error: value, loading: false });
      } else {
        const { firstItemKey } = this.state;
        const newFirstItemKey = value.items[0]
          ? this.getItemKey(value.items[0])
          : undefined;
        const shouldAnimate =
          !!firstItemKey && firstItemKey !== newFirstItemKey;

        this.setState({
          collection: value,
          shouldAnimate,
          loading: false,
          firstItemKey: newFirstItemKey,
          error: undefined,
        });
      }
    };
  }

  private subscribe(nextProps: CardListProps) {
    const { collectionName, context } = nextProps;
    const pageSize = this.props.pageSize || CardList.defaultPageSize;
    const provider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );

    const subscription = provider.observable().subscribe({
      next: this.handleNextItems(),
    });

    this.setState({ subscription });
  }

  private shouldUpdateState(nextProps: CardListProps): boolean {
    return (
      nextProps.collectionName !== this.props.collectionName ||
      nextProps.context !== this.props.context ||
      nextProps.pageSize !== this.props.pageSize
    );
  }

  private updateState(nextProps: CardListProps): void {
    const { collectionName, context } = nextProps;
    const pageSize = this.props.pageSize || CardList.defaultPageSize;
    const provider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );

    this.unsubscribe();

    // Setting the subscription after the state has been applied
    this.setState(
      {
        loadNextPage: () => provider.loadNextPage(),
        error: undefined,
        collection: undefined,
        firstItemKey: undefined,
      },
      () => this.subscribe(nextProps),
    );
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps: CardListProps): void {
    if (this.shouldUpdateState(nextProps)) {
      this.updateState(nextProps);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  private handleInfiniteScrollThresholdReached = () => {
    this.loadNextPage();
  };

  get isEmpty(): boolean {
    const { collection } = this.state;

    return !!(collection && collection.items.length === 0);
  }

  render() {
    const {
      height,
      emptyComponent,
      loadingComponent,
      errorComponent,
    } = this.props;
    const { loading, error, collection } = this.state;

    if (loading) {
      return loadingComponent;
    }

    if (error) {
      if (isCollectionNotFoundError(error)) {
        return emptyComponent;
      } else {
        return errorComponent;
      }
    }

    if (!collection) {
      return loadingComponent;
    }

    if (this.isEmpty) {
      return emptyComponent;
    }

    if (this.useInfiniteScroll) {
      return (
        <InfiniteScroll
          height={height}
          onThresholdReached={this.handleInfiniteScrollThresholdReached}
        >
          {this.renderList()}
        </InfiniteScroll>
      );
    }
    return this.renderList();
  }

  private renderList(): JSX.Element {
    const { collection, shouldAnimate } = this.state;
    const { cardWidth, dimensions, handleCardClick } = this;
    const {
      cardAppearance,
      shouldLazyLoadCards,
      collectionName,
      context,
    } = this.props;
    const actions = this.props.actions || [];
    const cardActions = (collectionItem: MediaCollectionItem) =>
      actions.map(action => {
        return {
          label: action.label,
          handler: (_: any, event: Event) => {
            if (collection) {
              action.handler(collectionItem, collection, event);
            }
          },
        };
      });

    const cards = collection
      ? collection.items.filter(item => item.type === 'file').map(mediaItem => {
          const key = this.getItemKey(mediaItem);
          const isLazy = shouldLazyLoadCards && !shouldAnimate; // We don't want to wrap new items into LazyContent aka lazy load new items
          const identifier: FileIdentifier = {
            id: mediaItem.details.id,
            collectionName,
            mediaItemType: 'file',
          };
          const cardListItem = (
            <CSSTransition
              key={key}
              classNames="card-list-item"
              timeout={{ enter: 750 }}
              exit={false}
              component="div"
              className="card-list"
            >
              <CardListItemWrapper
                shouldAnimate={shouldAnimate}
                cardWidth={cardWidth}
              >
                <Card
                  context={context}
                  identifier={identifier}
                  appearance={cardAppearance}
                  dimensions={dimensions}
                  isLazy={isLazy}
                  onClick={handleCardClick.bind(this, mediaItem)}
                  actions={cardActions(mediaItem) as any}
                />
              </CardListItemWrapper>
            </CSSTransition>
          );

          return cardListItem;
        })
      : null;

    return <TransitionGroup>{cards}</TransitionGroup>;
  }

  private handleCardClick(oldItem: MediaCollectionItem, cardEvent: CardEvent) {
    const { collectionName, onCardClick } = this.props;

    if (!onCardClick) {
      return;
    }

    const { event, mediaItemDetails } = cardEvent;

    // need to merge the new details with the old details (as the old details may be out of date) and we need the occurrenceKey
    const newItem: MediaCollectionItem = {
      type: oldItem.type,
      details: {
        ...oldItem.details,
        ...mediaItemDetails,
      },
    } as MediaCollectionItem;

    const cardListEvent: CardListEvent = {
      event,
      collectionName,
      mediaCollectionItem: newItem,
    };

    onCardClick(cardListEvent);
  }

  /*
    We only want to apply default width (hardcoded value) for normal cards,
    in case of small cards we want them to grow up and use the whole parent width
   */
  private get cardWidth(): string | number | undefined {
    const { cardDimensions, cardAppearance } = this.props;

    if (cardDimensions) {
      return cardDimensions.width;
    }

    if (cardAppearance === 'image') {
      return defaultImageCardDimensions.width;
    }

    if (cardAppearance === 'small') {
      return '100%';
    }

    return undefined;
  }

  private get cardHeight(): string | number | undefined {
    const { cardDimensions, cardAppearance } = this.props;

    if (cardDimensions && cardDimensions.height) {
      return cardDimensions.height;
    }
    if (cardAppearance === 'image') {
      return defaultImageCardDimensions.height;
    }
    if (cardAppearance === 'small') {
      return defaultSmallCardDimensions.height;
    }

    return undefined;
  }

  private get useInfiniteScroll(): boolean {
    return this.props.useInfiniteScroll
      ? true
      : !this.isNullOrUndefined(this.props.height);
  }

  private isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  private getItemKey(item: MediaCollectionItem): string {
    return `${item.details.id}-${item.details.occurrenceKey}`;
  }

  private get dimensions(): CardDimensions {
    const { cardWidth, cardHeight } = this;
    return {
      width: cardWidth,
      height: cardHeight,
    };
  }

  loadNextPage = (): void =>
    this.state.loadNextPage && this.state.loadNextPage();
}
