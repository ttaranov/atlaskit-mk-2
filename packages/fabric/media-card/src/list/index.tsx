/* tslint:disable:variable-name */
import * as React from 'react';
import { Component } from 'react';
import { Subscription } from 'rxjs/Subscription';
import { AxiosError } from 'axios';
import {
  MediaItem,
  MediaCollection,
  MediaCollectionItem,
  Context,
  CollectionAction,
} from '@atlaskit/media-core';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import WithItemDetails from '../WithItemDetails';
import WithFileImage from '../WithFileImage';
import {
  defaultImageCardDimensions,
  defaultSmallCardDimensions,
} from '../utils';
import { LazyContent } from '../utils/lazyContent';
import { CardDimensions, CardListEvent, CardEvent } from '..';
import { CardView } from '../root';
import { InfiniteScroll } from './infiniteScroll';
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
  collection?: MediaCollection;
  error?: AxiosError;
}

// FIXME: these aren't "components", they're actually "elements"... we should rename these or change the signature to be a "component" e.g. () => (<Spinner.../>);. Will clean up the tests a bit too.
const LoadingComponent = (
  <Spinner className="spinner" style={{ width: '100%', height: '100%' }}>
    loading...
  </Spinner>
);
const EmptyComponent = <div>No items</div>;
const ErrorComponent = <div>ERROR</div>;

function loading(): Pick<
  CardListState,
  'loading' | 'error' | 'collection' | 'firstItemKey'
> {
  return {
    loading: true,
    error: undefined,
    collection: undefined,
    firstItemKey: undefined,
  };
}

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

  private subscription?: Subscription;
  private loadNextPage?: () => void;

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleNextItems() {
    return (collection: MediaCollection) => {
      const { firstItemKey } = this.state;
      const newFirstItemKey = collection.items[0]
        ? this.getItemKey(collection.items[0])
        : undefined;
      const shouldAnimate = !!firstItemKey && firstItemKey !== newFirstItemKey;

      this.setState({
        collection,
        shouldAnimate,
        loading: false,
        firstItemKey: newFirstItemKey,
      });
    };
  }

  private subscribe() {
    const { collectionName, context } = this.props;
    const pageSize = this.props.pageSize || CardList.defaultPageSize;
    const provider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );

    this.subscription = provider.observable().subscribe({
      next: this.handleNextItems(),
      error: (error: AxiosError): void => {
        this.setState({ collection: undefined, error, loading: false });
      },
    });
  }

  private shouldUpdateState(
    prevProps: CardListProps,
    nextProps: CardListProps,
  ): boolean {
    return (
      nextProps.collectionName !== prevProps.collectionName ||
      nextProps.context !== prevProps.context ||
      nextProps.pageSize !== prevProps.pageSize
    );
  }

  private updateState(): void {
    const { collectionName, context } = this.props;
    const pageSize = this.props.pageSize || CardList.defaultPageSize;
    const provider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );

    this.unsubscribe();

    // Setting the subscription after the state has been applied
    this.loadNextPage = () => {
      provider.loadNextPage();
    };
    this.subscribe();
  }

  componentDidMount() {
    this.updateState();
  }

  componentWillReceiveProps(nextProps: CardListProps): void {
    if (this.shouldUpdateState(this.props, nextProps)) {
      this.setState(loading());
    }
  }

  componentDidUpdate(prevProps: CardListProps) {
    if (this.shouldUpdateState(prevProps, this.props)) {
      this.updateState();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  private handleInfiniteScrollThresholdReached = () => {
    if (this.loadNextPage) {
      this.loadNextPage();
    }
  };

  render(): JSX.Element {
    const { height } = this.props;
    const { loading, error, collection } = this.state;
    const emptyComponent = this.props.emptyComponent || EmptyComponent;
    const loadingComponent = this.props.loadingComponent || LoadingComponent;
    const errorComponent = this.props.errorComponent || ErrorComponent;

    if (loading) {
      return loadingComponent;
    }

    if (error) {
      if (error.response && error.response.status === 404) {
        return emptyComponent;
      }
      return errorComponent;
    }

    if (!collection) {
      return loadingComponent;
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

  private renderCard(mediaItem: MediaCollectionItem): JSX.Element {
    const { dimensions, handleCardClick } = this;
    const {
      context,
      collectionName,
      cardAppearance,
      actions = [],
    } = this.props;
    const { collection } = this.state;

    const { type, details } = mediaItem;
    const id = mediaItem.details.id || 'unknown-id'; // I think ID is always returned by the server but it is optional in our typings for another use-case

    const cardActions = (collectionItem: MediaCollectionItem) =>
      actions.map(action => {
        return {
          label: action.label,
          type: action.type,
          handler: (item: MediaItem, event: Event) => {
            if (collection) {
              action.handler(collectionItem, collection, event);
            }
          },
        };
      });

    const commonProps = {
      appearance: cardAppearance,
      dimensions,
      onClick: handleCardClick.bind(this, mediaItem),
      actions: cardActions(mediaItem),
    };

    if (type === 'file') {
      return (
        <WithItemDetails
          context={context}
          type={type}
          id={id}
          collection={collectionName}
          initialDetails={details}
        >
          {({ status, details }) => (
            <WithFileImage
              context={context}
              details={details}
              appearance={cardAppearance}
            >
              {({ src }) => (
                <CardView
                  {...commonProps}
                  status={status}
                  metadata={details}
                  dataURI={src}
                />
              )}
            </WithFileImage>
          )}
        </WithItemDetails>
      );
    }

    if (type === 'link') {
      return (
        <WithItemDetails
          context={context}
          type={type}
          id={id}
          collection={collectionName}
          initialDetails={details}
        >
          {({ status, details }) => (
            <CardView {...commonProps} status={status} metadata={details} />
          )}
        </WithItemDetails>
      );
    }

    // this case should never happen but is required for typescript to be happy
    throw new Error('Unsupported media item type.');
  }

  private renderList(): JSX.Element {
    const { collection, shouldAnimate } = this.state;
    const { cardWidth, placeholder } = this;
    const { shouldLazyLoadCards } = this.props;
    const cards = collection
      ? collection.items.map((mediaItem: MediaCollectionItem) => {
          if (!mediaItem.details || !mediaItem.details.id) {
            return null;
          }
          const key = this.getItemKey(mediaItem);
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
                {this.renderCard(mediaItem)}
              </CardListItemWrapper>
            </CSSTransition>
          );
          // We don't want to wrap new items into LazyContent aka lazy load new items
          const useLazyContent = shouldLazyLoadCards && !shouldAnimate;
          return useLazyContent ? (
            <LazyContent key={key} placeholder={placeholder}>
              {cardListItem}
            </LazyContent>
          ) : (
            cardListItem
          );
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

  private get placeholder(): JSX.Element {
    const { cardWidth, dimensions } = this;
    const { cardAppearance } = this.props;
    return (
      <CardListItemWrapper cardWidth={cardWidth}>
        <CardView
          dimensions={dimensions}
          status="loading"
          appearance={cardAppearance}
        />
      </CardListItemWrapper>
    );
  }
}
