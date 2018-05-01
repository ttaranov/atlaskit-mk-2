import * as React from 'react';
import { Outcome, Identifier } from './domain';
import { Context, FileItem } from '@atlaskit/media-core';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';

export type Props = {
  readonly identifier: Identifier;
  readonly context: Context;
};

export type State = {
  item: Outcome<FileItem, Error>;
};

export default class Header extends React.Component<Props, State> {
  state: State = { item: { status: 'PENDING' } };

  private subscription: Subscription;

  componentWillUpdate(nextProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps);
    }
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillUnmount() {
    this.release();
  }

  private init(props: Props) {
    const { context, identifier } = props;
    const provider = context.getMediaItemProvider(
      identifier.id,
      identifier.type,
      identifier.collectionName,
    );

    this.subscription = provider.observable().subscribe({
      next: mediaItem => {
        if (mediaItem.type === 'file') {
          this.setState({
            item: {
              status: 'SUCCESSFUL',
              data: mediaItem,
            },
          });
        }
      },
      error: err => {
        this.setState({
          item: {
            status: 'FAILED',
            err,
          },
        });
      },
    });
  }

  render() {
    const { item } = this.state;
    switch (item.status) {
      case 'PENDING':
        return '';
      case 'SUCCESSFUL':
        return <span>{item.data.details.name || ''}</span>;
      case 'FAILED':
        return '';
    }
  }

  private needsReset(propsA: Props, propsB: Props) {
    return (
      !deepEqual(propsA.identifier, propsB.identifier) ||
      propsA.context !== propsB.context
    );
  }

  private release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
