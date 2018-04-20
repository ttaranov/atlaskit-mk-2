import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { ErrorMessage } from './styled';
import { Outcome, Identifier } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { PDFViewer } from './viewers/pdf';
import { Spinner } from './loading';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';

export type Props = {
  readonly identifier: Identifier;
  readonly context: Context;
};

export type State = {
  item: Outcome<FileItem, Error>;
};

export class ItemViewer extends React.Component<Props, State> {
  state: State = { item: { status: 'PENDING' } };

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
    const { context } = this.props;
    const { item } = this.state;
    switch (item.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        const itemUnwrapped = item.data;
        switch (itemUnwrapped.details.mediaType) {
          case 'image':
            return <ImageViewer context={context} item={itemUnwrapped} />;
          case 'audio':
          case 'video':
            return <VideoViewer context={context} item={itemUnwrapped} />;
          case 'doc':
            return <PDFViewer context={context} item={itemUnwrapped} />;
          default:
            return <ErrorMessage>This file is unsupported</ErrorMessage>;
        }
      case 'FAILED':
        return <ErrorMessage>{item.err.message}</ErrorMessage>;
    }
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
        if (mediaItem.type === 'link') {
          this.setState({
            item: {
              status: 'FAILED',
              err: new Error('links are not supported at the moment'),
            },
          });
        } else {
          const { processingStatus } = mediaItem.details;
          if (processingStatus === 'failed') {
            this.setState({
              item: {
                status: 'FAILED',
                err: new Error('processing failed'),
              },
            });
          } else if (processingStatus === 'succeeded') {
            this.setState({
              item: {
                status: 'SUCCESSFUL',
                data: mediaItem,
              },
            });
          }
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

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
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
