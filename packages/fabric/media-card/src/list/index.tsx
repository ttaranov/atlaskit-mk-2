/* tslint:disable:variable-name */
import * as React from 'react';
import { Component } from 'react';
import {
  MediaCollection,
  MediaCollectionItem,
  Context,
  CollectionAction,
} from '@atlaskit/media-core';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {
  defaultImageCardDimensions,
  defaultSmallCardDimensions,
} from '../utils';
import { LazyContent } from '../utils/lazyContent';
import { CardDimensions, CardListEvent, CardEvent } from '..';
import { CardView } from '../root';
import { CardListItemWrapper, Spinner } from './styled';
import { CollectionRenderer } from '../renderers/collectionRenderer';
import { DataUriRenderer } from '../renderers/dataUriRenderer';

export type CardLayout = 'grid' | 'list';

export interface CardListProps {
  readonly context: Context;
  readonly collectionName: string;

  readonly height?: number;
  readonly pageSize?: number;

  readonly cardDimensions?: CardDimensions;
  readonly cardAppearance?: 'small' | 'image';

  readonly onCardClick?: (result: CardListEvent) => void;
  readonly actions?: Array<CollectionAction>;

  readonly layout?: CardLayout;
  readonly selectedItemIds?: string[];

  /**
   * Infinite scrolling is only enabled when height has also been specified.
   */
  readonly useInfiniteScroll?: boolean;
  readonly shouldLazyLoadCards?: boolean;
  readonly errorComponent?: JSX.Element;
  readonly loadingComponent?: JSX.Element;
  readonly emptyComponent?: JSX.Element;
}

// FIXME: these aren't "components", they're actually "elements"... we should rename these or change the signature to be a "component" e.g. () => (<Spinner.../>);. Will clean up the tests a bit too.
const LoadingComponent = (
  <Spinner className="spinner" style={{ width: '100%', height: '100%' }}>
    loading...
  </Spinner>
);
const EmptyComponent = <div>No items</div>;
const ErrorComponent = <div>ERROR</div>;

export class CardList extends Component<CardListProps> {
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

  render(): JSX.Element {
    const {
      context,
      collectionName,
      pageSize,
      height,
      emptyComponent = EmptyComponent,
      loadingComponent = LoadingComponent,
      errorComponent = ErrorComponent,
    } = this.props;

    return (
      <CollectionRenderer
        context={context}
        collectionName={collectionName}
        pageSize={pageSize}
        useInfiniteScroll={this.useInfiniteScroll}
        height={height}
      >
        {({ collection, isLoading, error, hasNewItems }) => {
          if (error) {
            if (error.response && error.response.status === 404) {
              return emptyComponent;
            } else {
              return errorComponent;
            }
          } else if (isLoading) {
            return loadingComponent;
          } else {
            return this.renderList(collection, hasNewItems);
          }
        }}
      </CollectionRenderer>
    );
  }

  private renderList(
    collection: MediaCollection | undefined,
    shouldAnimate: boolean,
  ): JSX.Element {
    const {
      cardWidth,
      dimensions,
      handleCardClick,
      placeholder,
      isGridLayout,
    } = this;
    const {
      context,
      collectionName,
      cardAppearance,
      shouldLazyLoadCards,
      layout,
    } = this.props;
    const items = collection ? collection.items : [];
    const actions = this.props.actions || [];
    const cardActions = (item: MediaCollectionItem) =>
      actions.map(({ label, type, handler }) => {
        return {
          label,
          type,
          handler: (item: MediaCollectionItem, event: Event) => {
            if (collection) {
              handler(item, collection, event);
            }
          },
        };
      });

    const cards = items.map(item => {
      const { details } = item;
      const key = this.getItemKey(item);
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
            <DataUriRenderer
              context={context}
              collectionName={collectionName}
              mediaItem={item}
            >
              {({ dataUri, isLoading }) => {
                return (
                  <CardView
                    status="complete"
                    dataURI={dataUri}
                    metadata={details}
                    appearance={cardAppearance}
                    dimensions={dimensions}
                    onClick={handleCardClick(item)}
                    actions={cardActions(item)}
                  />
                );
              }}
            </DataUriRenderer>
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

  private handleCardClick = (oldItem: MediaCollectionItem) => (
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

  private getItemKey({
    details: { id, occurrenceKey },
  }: MediaCollectionItem): string {
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
}
