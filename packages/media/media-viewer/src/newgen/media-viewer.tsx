import * as React from 'react';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import { Context, MediaType } from '@atlaskit/media-core';
import { ItemViewer } from './item-viewer';
import { Model, Identifier, initialModel } from './domain';
import { Blanket, Header, Content } from './styled';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = Model;

export class MediaViewer extends React.Component<Props, State> {
  state: State = initialModel;

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.release();
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  componentWillUpdate(nextProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.setState(initialModel);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.needsReset(this.props, prevProps)) {
      this.release();
      this.init();
    }
  }

  render() {
    const { onClose, context } = this.props;
    const { fileDetails } = this.state;
    const item =
      fileDetails.status === 'SUCCESSFUL' ? fileDetails.data.item : void 0;
    return (
      <Blanket onClick={onClose}>
        {fileDetails.status === 'SUCCESSFUL' && (
          <Header>{fileDetails.data.name || 'No name given'}</Header>
        )}
        <Content>
          <ItemViewer model={this.state} context={context} item={item} />
        </Content>
      </Blanket>
    );
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  private needsReset(propsA, propsB) {
    return (
      !deepEqual(propsA.data, propsB.data) || propsA.context !== propsB.context
    );
  }

  private itemDetails?: Subscription;

  private init() {
    const { context } = this.props;
    const { id, type, collectionName } = this.props.data;
    const provider = context.getMediaItemProvider(id, type, collectionName);

    this.itemDetails = provider.observable().subscribe({
      next: mediaItem => {
        if (mediaItem.type === 'link') {
          this.setState({
            fileDetails: {
              status: 'FAILED',
              err: new Error('links are not supported at the moment'),
            },
          });
        } else {
          const { processingStatus, mediaType } = mediaItem.details;

          if (processingStatus === 'failed') {
            this.setState({
              fileDetails: {
                status: 'FAILED',
                err: new Error('processing failed'),
              },
            });
          } else if (processingStatus === 'succeeded') {
            this.setState({
              fileDetails: {
                status: 'SUCCESSFUL',
                data: {
                  mediaType: mediaType as MediaType,
                  name: mediaItem.details.name,
                  item: mediaItem,
                },
              },
            });
          }
        }
      },
      error: err => {
        this.setState({
          fileDetails: {
            status: 'FAILED',
            err,
          },
        });
      },
    });
  }

  private release() {
    if (this.itemDetails) {
      this.itemDetails.unsubscribe();
    }
  }
}
