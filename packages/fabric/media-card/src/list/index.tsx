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
  DataUriService,
} from '@atlaskit/media-core';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {
  defaultImageCardDimensions,
  defaultSmallCardDimensions,
} from '../utils';
import { LazyContent } from '../utils/lazyContent';
import { CardDimensions, CardListEvent, CardEvent } from '..';
import { Provider, MediaCard, CardView } from '../root';
import { InfiniteScroll } from './infiniteScroll';
import { CardListItemWrapper, Spinner } from './styled';
import {
  CollectionRenderer,
  CollectionItem,
} from '../renderers/collectionRenderer';

export type CardLayout = 'grid' | 'list';

export interface CardListProps {
  context: Context;
  collectionName: string;

  height?: number;
  pageSize?: number;

  cardDimensions?: CardDimensions;
  cardAppearance?: 'small' | 'image';

  onCardClick?: (result: CardListEvent) => void;
  actions?: Array<CollectionAction>;

  layout?: CardLayout;
  readonly selectedItemIds?: string[];

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
  selectedCards: string[];
  firstItemKey?: string;
  subscription?: Subscription;
  loadNextPage?: () => void;
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
    layout: 'list',
  };

  state: CardListState = {
    loading: true,
    shouldAnimate: false,
    selectedCards: [],
  };

  providersByMediaItemId: { [id: string]: Provider } = {};
  private dataURIService: DataUriService;

  private unsubscribe() {
    const { subscription } = this.state;
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  // handleNextItems(nextProps: CardListProps) {
  //   const { collectionName, context } = nextProps;

  //   return (collection: MediaCollection) => {
  //     const { firstItemKey } = this.state;
  //     const newFirstItemKey = collection.items[0]
  //       ? this.getItemKey(collection.items[0])
  //       : undefined;
  //     const shouldAnimate = !!firstItemKey && firstItemKey !== newFirstItemKey;
  //     this.providersByMediaItemId = {};
  //     collection.items.forEach(mediaItem => {
  //       if (!mediaItem.details || !mediaItem.details.id) {
  //         return;
  //       }

  //       this.providersByMediaItemId[
  //         mediaItem.details.id
  //       ] = context.getMediaItemProvider(
  //         mediaItem.details.id,
  //         mediaItem.type,
  //         collectionName,
  //         mediaItem,
  //         );
  //     });

  //     this.setState({
  //       collection,
  //       shouldAnimate,
  //       loading: false,
  //       firstItemKey: newFirstItemKey,
  //     });
  //   };
  // }

  private subscribe(nextProps: CardListProps) {
    // const { collectionName, context } = nextProps;
    // const pageSize = this.props.pageSize || CardList.defaultPageSize;
    // const provider = context.getMediaCollectionProvider(
    //   collectionName,
    //   pageSize,
    // );
    // const subscription = provider.observable().subscribe({
    //   next: this.handleNextItems(nextProps),
    //   error: (error: AxiosError): void => {
    //     this.setState({ collection: undefined, error, loading: false });
    //   },
    // });
    // this.setState({ subscription });
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

    this.dataURIService = context.getDataUriService(collectionName);

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

  render(): JSX.Element {
    const { context, collectionName, height } = this.props;
    // const { loading, error, collection } = this.state;
    // const emptyComponent = this.props.emptyComponent || EmptyComponent;
    const loadingComponent = this.props.loadingComponent || LoadingComponent;
    // const errorComponent = this.props.errorComponent || ErrorComponent;

    // if (loading) {
    //   return loadingComponent;
    // }

    // if (error) {
    //   if (error.response && error.response.status === 404) {
    //     return emptyComponent;
    //   } else {
    //     return errorComponent;
    //   }
    // }

    // if (!collection) {
    //   return loadingComponent;
    // }

    // TODO: Error State needs to be handled;

    return (
      <CollectionRenderer
        context={context}
        collectionName={collectionName}
        useInfiniteScroll={this.useInfiniteScroll}
        height={height}
      >
        {({ items, isLoading }) => {
          if (isLoading) {
            return loadingComponent;
          } else {
            return this.renderList(items);
          }
        }}
      </CollectionRenderer>
    );
  }

  private renderList(items: CollectionItem[]): JSX.Element {
    const { shouldAnimate } = this.state;
    const {
      cardWidth,
      dimensions,
      providersByMediaItemId,
      dataURIService,
      handleCardClick,
      placeholder,
      isGridLayout,
    } = this;
    const {
      cardAppearance,
      shouldLazyLoadCards,
      layout,
      selectedItemIds = [],
    } = this.props;
    const actions = this.props.actions || [];
    // const cardActions = (collectionItem: MediaCollectionItem) =>
    //   actions.map(action => {
    //     return {
    //       label: action.label,
    //       type: action.type,
    //       handler: (item: MediaItem, event: Event) => {
    //         if (collection) {
    //           action.handler(collectionItem, collection, event);
    //         }
    //       },
    //     };
    //   });
    const cards = items.map(mediaItem => {
      const { id } = mediaItem;
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
            layout={layout}
          >
            <CardView
              status="complete"
              dataURI={mediaItem.thumbnailSrc}
              metadata={{
                name: mediaItem.fileName,
                size: mediaItem.size,
                type: mediaItem.type,
                mediaType: mediaItem.mediaType,
              }}
              appearance={cardAppearance}
              dimensions={dimensions}
              onClick={handleCardClick(mediaItem)}
              // actions={cardActions(mediaItem)} TODO: implement actions
              selectable={isGridLayout}
              selected={mediaItem.isSelected}
            />
          </CardListItemWrapper>
        </CSSTransition>
      );
      // We don't want to wrap new items into LazyContent aka lazy load new items
      const useLazyContent =
        shouldLazyLoadCards && !shouldAnimate && !isGridLayout;
      return useLazyContent ? (
        <LazyContent key={key} placeholder={placeholder}>
          {cardListItem}
        </LazyContent>
      ) : (
        cardListItem
      );
    });

    return <TransitionGroup>{cards}</TransitionGroup>;
  }

  private handleCardClick = (oldItem: CollectionItem) => (
    cardEvent: CardEvent,
  ) => {
    const { collectionName, onCardClick } = this.props;

    if (!onCardClick) {
      return;
    }

    const { event, mediaItemDetails } = cardEvent;

    // need to merge the new details with the old details (as the old details may be out of date) and we need the occurrenceKey
    const newItem: MediaCollectionItem = {
      type: oldItem.type,
      details: {
        id: oldItem.id,
        name: oldItem.fileName, // TODO: probably need to copy more things from item to event payload

        ...mediaItemDetails,
      },
    } as MediaCollectionItem;

    const cardListEvent: CardListEvent = {
      event,
      collectionName,
      mediaCollectionItem: newItem,
    };

    onCardClick(cardListEvent);
  };

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

  get isGridLayout() {
    return this.props.layout === 'grid';
  }
  private get useInfiniteScroll(): boolean {
    return this.props.useInfiniteScroll
      ? true
      : !this.isNullOrUndefined(this.props.height);
  }

  private isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  private getItemKey({ id, occurrenceKey }: CollectionItem): string {
    return `${id}-${occurrenceKey}`;
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

  loadNextPage = (): void =>
    this.state.loadNextPage && this.state.loadNextPage();
}
