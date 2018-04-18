import * as React from 'react';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import { Context, FileItem } from '@atlaskit/media-core';
import { ItemViewer } from './item-viewer';
import { Identifier, Outcome } from './domain';
import { Blanket, Header, Content } from './styled';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = {
  fileDetails: Outcome<FileItem, Error>;
};

const intialState: State = {
  fileDetails: { status: 'PENDING' },
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = intialState;

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
      this.setState(intialState);
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
    return (
      <Blanket onClick={onClose}>
        {fileDetails.status === 'SUCCESSFUL' && (
          <Header>{fileDetails.data.details.name || 'No name given'}</Header>
        )}
        <Content>
          <ItemViewer item={this.state.fileDetails} context={context} />
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
          const { processingStatus } = mediaItem.details;

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
                data: mediaItem,
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
