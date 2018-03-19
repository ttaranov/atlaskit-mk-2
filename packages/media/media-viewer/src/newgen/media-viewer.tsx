import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Context, MediaType } from '@atlaskit/media-core';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { Model, Identifier, initialModel } from './domain';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = {
  model: Model;
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = { model: initialModel };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      // It's possible that a different identifier or context was passed.
      // We therefore need to reset Media Viewer.
      this.setState({ model: initialModel });
      this._unsubscribe();
      this._subscribe();
    }
  }

  render() {
    const { onClose } = this.props;
    const { model } = this.state;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <MediaViewerRenderer model={model} />
      </div>
    );
  }

  private _subscription?: any;

  private _subscribe() {
    const { id, type, collectionName } = this.props.data;
    const provider = this.props.context.getMediaItemProvider(
      id,
      type,
      collectionName,
    );

    this._subscription = provider.observable().subscribe({
      next: mediaItem => {
        if (mediaItem.type === 'link') {
          const model: Model = {
            type: 'FAILED',
            err: new Error('links are not supported at the moment'),
          };
          this.setState({ model });
        } else {
          const { processingStatus, mediaType } = mediaItem.details;

          if (processingStatus === 'failed') {
            const model: Model = {
              type: 'FAILED',
              err: new Error('processing failed'),
            };
            this.setState({ model });
          } else if (processingStatus === 'succeeded') {
            const model: Model = {
              type: 'SUCCESS',
              item: {
                mediaType: mediaType as MediaType,
              },
            };
            this.setState({ model });
          }
        }
      },
      complete: () => {
        /* do nothing */
      },
      error: err => {
        const model: Model = {
          type: 'FAILED',
          err,
        };
        this.setState({ model });
      },
    });
  }

  private _unsubscribe() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
}
