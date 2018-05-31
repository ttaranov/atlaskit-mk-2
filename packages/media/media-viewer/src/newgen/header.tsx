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
import { constructAuthTokenUrl } from './util';
import VidShareScreenIcon from '@atlaskit/icon/glyph/vid-share-screen';

export type Props = {
  readonly identifier: Identifier;
  readonly context: Context;
  readonly onClose?: () => void;
  readonly onWidget?: () => void;
};

export type State = {
  item: Outcome<FileItem, Error>;
};

export const createDownloadUrl = async (
  item: FileItem,
  context: Context,
  collectionName?: string,
): Promise<string> => {
  const url = `/file/${item.details.id}/binary`;
  const tokenizedUrl = await constructAuthTokenUrl(
    url,
    context,
    collectionName,
  );

  return `${tokenizedUrl}&dl=true`;
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

  downloadItem = (item: FileItem) => async () => {
    const { identifier, context } = this.props;
    const link = document.createElement('a');
    const name = item.details.name || 'download';
    const href = await createDownloadUrl(
      item,
      context,
      identifier.collectionName,
    );

    link.href = href;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  private renderDownload = () => {
    const { item } = this.state;
    if (item.status !== 'SUCCESSFUL') {
      return;
    }

    return (
      <Button
        onClick={this.downloadItem(item.data)}
        iconBefore={<DownloadIcon label="download" />}
      />
    );
  };

  render() {
    return (
      <HeaderWrapper className={hideControlsClassName}>
        <LeftHeader>{this.renderMetadata()}</LeftHeader>
        <RightHeader>
          {this.renderDownload()}
          <FeedbackButton />
          {this.renderWidgetButtonIfRequired()}
        </RightHeader>
      </HeaderWrapper>
    );
  }

  private renderWidgetButtonIfRequired() {
    const { item } = this.state;
    if (
      item.status === 'SUCCESSFUL' &&
      (item.data.details.mediaType === 'audio' ||
        item.data.details.mediaType === 'video')
    ) {
      return (
        <Button
          onClick={this.props.onWidget}
          iconBefore={<VidShareScreenIcon label="Open as widget" />}
        />
      );
    }
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
