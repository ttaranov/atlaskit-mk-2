import * as React from 'react';
import { Context, FileItem, MediaType } from '@atlaskit/media-core';
import Button from '@atlaskit/button';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import { Outcome, Identifier } from './domain';
import {
  Header as HeaderWrapper,
  LeftHeader,
  RightHeader,
  MetadataWrapper,
  MetadataSubText,
  MetadataIconWrapper,
  MetadataFileName,
  hideControlsClassName,
} from './styled';
import { MediaTypeIcon } from './media-type-icon';
import { FeedbackButton } from './feedback-button';
import { downloadItem } from './domain/download';
import { MediaViewerError, createError } from './error';

export type Props = {
  readonly identifier: Identifier;
  readonly context: Context;
  readonly onClose?: () => void;
};

export type State = {
  item: Outcome<FileItem, MediaViewerError>;
};

const initialState: State = {
  item: { status: 'PENDING' },
};

export default class Header extends React.Component<Props, State> {
  state: State = initialState;

  private subscription?: Subscription;

  componentWillUpdate(nextProps: Props) {
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
                err: createError('linksNotSupported'),
              },
            });
          }
        },
        error: err => {
          this.setState({
            item: {
              status: 'FAILED',
              err: createError('metadataFailed', undefined, err),
            },
          });
        },
      });
    });
  }

  private renderDownload = () => {
    const { item } = this.state;
    const { identifier, context } = this.props;
    const icon = <DownloadIcon label="Download" />;
    if (item.status !== 'SUCCESSFUL') {
      return (
        <Button
          label="Download"
          appearance="toolbar"
          isDisabled={true}
          iconBefore={icon}
        />
      );
    } else {
      return (
        <Button
          label="Download"
          appearance="toolbar"
          onClick={downloadItem(item.data, context, identifier.collectionName)}
          iconBefore={icon}
        />
      );
    }
  };

  render() {
    return (
      <HeaderWrapper className={hideControlsClassName}>
        <LeftHeader>{this.renderMetadata()}</LeftHeader>
        <RightHeader>
          <FeedbackButton />
          {this.renderDownload()}
        </RightHeader>
      </HeaderWrapper>
    );
  }

  private renderMetadata() {
    const { item } = this.state;
    switch (item.status) {
      case 'PENDING':
        return '';
      case 'SUCCESSFUL':
        return this.renderMetadataLayout(item.data);
      case 'FAILED':
        return '';
    }
  }

  private renderMetadataLayout(item: FileItem) {
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
    if (mediaType === 'doc') {
      return 'document';
    } else {
      return mediaType || 'unknown';
    }
  };

  private getMediaIcon = (mediaType?: MediaType) => {
    return <MediaTypeIcon type={mediaType} />;
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
