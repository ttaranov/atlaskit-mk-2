import * as React from 'react';
import { Outcome, Identifier } from './domain';
import { Context, FileItem, MediaType } from '@atlaskit/media-core';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import {
  Header as HeaderWrapper,
  LeftHeader,
  MetadataWrapper,
  MetadataSubText,
  MetadataIconWrapper,
  MetadataFileName,
} from './styled';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import { MediaTypeIcon } from './media-type-icon';

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
      </HeaderWrapper>
    );
  }

  private renderMetadata() {
    const { item } = this.state;
    switch (item.status) {
      case 'PENDING':
        return '';
      case 'SUCCESSFUL':
        return this.getMetadataLayout(item.data);
      case 'FAILED':
        return '';
    }
  }

  private getMetadataLayout(item: FileItem) {
    return (
      <MetadataWrapper>
        <MetadataIconWrapper>
          {this.getMediaIcon(item.details.mediaType)}
        </MetadataIconWrapper>
        <div>
          <MetadataFileName>{item.details.name || 'unknown'}</MetadataFileName>
          <MetadataSubText>
            {this.renderFileTypeText(item.details.mediaType)}
            {this.renderSize(item)}
          </MetadataSubText>
        </div>
      </MetadataWrapper>
    );
  }

  private renderSize = (item: FileItem) => {
    if (item.details.size) {
      return (
        this.renderSeparator() + toHumanReadableMediaSize(item.details.size)
      );
    } else {
      return '';
    }
  };

  private renderSeparator = () => {
    return ' · ';
  };

  private renderFileTypeText = (mediaType?: MediaType): string => {
    switch (mediaType) {
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'doc':
        return 'document';
      default:
        return 'unknown';
    }
  };

  private getMediaIcon = (mediaType?: MediaType) => {
    return <MediaTypeIcon type={mediaType} size="large" />;
  };

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
