import * as React from 'react';
import {
  Context,
  MediaCollectionItem,
  MediaCollectionProvider,
  isError,
} from '@atlaskit/media-core';
import { Outcome, Identifier, MediaViewerFeatureFlags } from './domain';
import { ErrorMessage, createError, MediaViewerError } from './error';
import { List } from './list';
import { Subscription } from 'rxjs';
import { toIdentifier } from './utils';
import { Spinner } from './loading';

export type Props = Readonly<{
  onClose?: () => void;
  defaultSelectedItem?: Identifier;
  showControls?: () => void;
  featureFlags?: MediaViewerFeatureFlags;
  collectionName: string;
  context: Context;
  pageSize: number;
}>;

export type State = {
  items: Outcome<MediaCollectionItem[], MediaViewerError>;
};

const initialState: State = { items: { status: 'PENDING' } };

export class Collection extends React.Component<Props, State> {
  state: State = initialState;

  private subscription?: Subscription;
  private provider?: MediaCollectionProvider;

  componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps);
    }
  }

  componentWillUnmount() {
    this.release();
  }

  componentDidMount() {
    this.init(this.props);
  }

  render() {
    const {
      defaultSelectedItem,
      context,
      onClose,
      collectionName,
      showControls,
    } = this.props;
    const { items } = this.state;
    switch (items.status) {
      case 'PENDING':
        return <Spinner />;
      case 'FAILED':
        return <ErrorMessage error={items.err} />;
      case 'SUCCESSFUL':
        const identifiers = items.data.map(x =>
          toIdentifier(x, collectionName),
        );
        const item = defaultSelectedItem
          ? { ...defaultSelectedItem, collectionName }
          : identifiers[0];
        return (
          <List
            items={identifiers}
            defaultSelectedItem={item}
            context={context}
            onClose={onClose}
            onNavigationChange={this.onNavigationChange}
            showControls={showControls}
          />
        );
    }
  }

  private init(props: Props) {
    this.setState(initialState);
    const { collectionName, context, defaultSelectedItem, pageSize } = props;
    this.provider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );
    const collectionFileItemFilter = (item: MediaCollectionItem) =>
      item.type === 'file';
    this.subscription = this.provider.observable().subscribe({
      next: collection => {
        if (isError(collection)) {
          this.setState({
            items: {
              status: 'FAILED',
              err: createError('metadataFailed', undefined, collection),
            },
          });
        } else {
          const items = collection.items.filter(collectionFileItemFilter);
          this.setState({
            items: {
              status: 'SUCCESSFUL',
              data: items,
            },
          });
          if (
            defaultSelectedItem &&
            this.shouldLoadNext(defaultSelectedItem, items)
          ) {
            if (this.provider) {
              this.provider.loadNextPage();
            }
          }
        }
      },
    });
  }

  private release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private needsReset(propsA: Props, propsB: Props) {
    return (
      propsA.collectionName !== propsB.collectionName ||
      propsA.context !== propsB.context
    );
  }

  private onNavigationChange = (item: Identifier) => {
    const { items } = this.state;
    if (
      items.status === 'SUCCESSFUL' &&
      this.provider &&
      this.shouldLoadNext(item, items.data)
    ) {
      this.provider.loadNextPage();
    }
  };

  private shouldLoadNext(
    selectedItem: Identifier,
    items: MediaCollectionItem[],
  ): boolean {
    if (items.length === 0) {
      return false;
    }
    return this.isLastItem(selectedItem, items);
  }

  private isLastItem(selectedItem: Identifier, items: MediaCollectionItem[]) {
    const lastItem = items[items.length - 1];
    const isLastItem =
      selectedItem.id === lastItem.details.id &&
      selectedItem.occurrenceKey === lastItem.details.occurrenceKey;
    return isLastItem;
  }
}
