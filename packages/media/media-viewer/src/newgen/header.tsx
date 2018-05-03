import * as React from 'react';
import { Outcome, Identifier } from './domain';
import { Context, FileItem } from '@atlaskit/media-core';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import {
  Header as HeaderWrapper,
  LeftHeader,
  RightHeader,
  CloseWrapper,
} from './styled';
import CrossIcon from '@atlaskit/icon/glyph/cross';

export type Props = {
  readonly identifier: Identifier;
  readonly context: Context;
  readonly onClose?: () => void;
};

export type State = {
  item: Outcome<FileItem, Error>;
};

const initialState: State = {
  item: { status: 'PENDING' },
};

export default class Header extends React.Component<Props, State> {
  state: State = initialState;

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
    this.setState(initialState, () => {
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
          } else if (mediaItem.type === 'link') {
            this.setState({
              item: {
                status: 'FAILED',
                err: new Error('links are not supported'),
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
    });
  }

  render() {
    return (
      <HeaderWrapper>
        <LeftHeader>{this.renderMetadata()}</LeftHeader>
        <RightHeader>
          <CloseWrapper>
            <CrossIcon label="Close" onClick={this.onClose} />
          </CloseWrapper>
        </RightHeader>
      </HeaderWrapper>
    );
  }

  private onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  private renderMetadata() {
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
