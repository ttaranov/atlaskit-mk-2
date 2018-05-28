import * as React from 'react';
import {
  Context,
  MediaCollectionItem,
  MediaCollectionProvider,
  isError,
} from '@atlaskit/media-core';
import { Outcome, Identifier } from './domain';
import { ErrorMessage } from './styled';
import { List } from './list';
import { Subscription } from 'rxjs';
import { toIdentifier } from './util';
import { Spinner } from './loading';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  showControls?: () => void;
  collectionName: string;
  context: Context;
  pageSize: number;
};

export type State = {
  items: Outcome<MediaCollectionItem[], Error>;
};

const initialState: State = { items: { status: 'PENDING' } };

export class Collection extends React.Component<Props, State> {
  state: State = initialState;

  private subscription: Subscription;
  private provider: MediaCollectionProvider;

  componentWillUpdate(nextProps) {
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
      selectedItem,
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
        return <ErrorMessage>Error loading collection</ErrorMessage>;
      case 'SUCCESSFUL':
        const identifiers = items.data.map(x =>
          toIdentifier(x, collectionName),
        );
        const item = selectedItem
          ? { ...selectedItem, collectionName }
          : identifiers[0];
        return (
          <List
            items={identifiers}
            selectedItem={item}
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
    const { collectionName, context, selectedItem, pageSize } = props;
    this.provider = context.getMediaCollectionProvider(
      collectionName,
      pageSize,
    );
    this.subscription = this.provider.observable().subscribe({
      next: collection => {
        if (isError(collection)) {
          this.setState({
            items: {
              status: 'FAILED',
              err: collection,
            },
          });
        } else {
          this.setState({
            items: {
              status: 'SUCCESSFUL',
              data: collection.items,
            },
          });
          if (selectedItem && this.shouldLoadNext(selectedItem)) {
            this.provider.loadNextPage();
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
    if (this.shouldLoadNext(item)) {
      this.provider.loadNextPage();
    }
  };

  private shouldLoadNext(selectedItem: Identifier): boolean {
    const { items } = this.state;
    if (items.status !== 'SUCCESSFUL' || items.data.length === 0) {
      return false;
    }
    return this.isLastItem(selectedItem, items.data);
  }

  private isLastItem(selectedItem: Identifier, items: MediaCollectionItem[]) {
    const lastItem = items[items.length - 1];
    const isLastItem =
      selectedItem.id === lastItem.details.id &&
      selectedItem.occurrenceKey === lastItem.details.occurrenceKey;
    return isLastItem;
  }
}
