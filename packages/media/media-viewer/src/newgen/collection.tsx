import * as React from 'react';
import { Context, MediaCollectionItem, isError } from '@atlaskit/media-core';
import { Outcome, Identifier } from './domain';
import { ErrorMessage } from './styled';
import { List } from './list';
import { Subscription } from 'rxjs';
import { toIdentifier } from './util';
import { Spinner } from './loading';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  collectionName: string;
  context: Context;
};

export type State = {
  items: Outcome<MediaCollectionItem[], Error>;
};

const initialState: State = { items: { status: 'PENDING' } };

export class Collection extends React.Component<Props, State> {
  state: State = initialState;

  private subscription: Subscription;

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
    const { selectedItem, context, onClose } = this.props;
    const { items } = this.state;
    switch (items.status) {
      case 'PENDING':
        return <Spinner />;
      case 'FAILED':
        return <ErrorMessage>Error loading collection</ErrorMessage>;
      case 'SUCCESSFUL':
        const identifiers = items.data.map(toIdentifier);
        return (
          <List
            items={identifiers}
            selectedItem={selectedItem ? selectedItem : identifiers[0]}
            context={context}
            onClose={onClose}
          />
        );
    }
  }

  private init(props: Props) {
    this.setState(initialState);
    const { collectionName, context } = props;
    const provider = context.getMediaCollectionProvider(collectionName, 30);
    this.subscription = provider.observable().subscribe({
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
}
