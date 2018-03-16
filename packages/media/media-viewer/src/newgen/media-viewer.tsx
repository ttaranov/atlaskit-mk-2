import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Context, MediaItemType, FileItem, MediaType } from '@atlaskit/media-core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { RendererModel, initialModel } from './domain';

export type Identifier = {
  type: MediaItemType;
  id: string;
  occurrenceKey: string;
  collectionName?: string;
};

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = {
  model: RendererModel;
};

export class MediaViewer extends React.Component<Props, State> {

  state: State = { model: initialModel };

  componentDidMount() {
    const { id, type, collectionName } = this.props.data;
    const provider = this.props.context.getMediaItemProvider(
      id,
      type,
      collectionName,
    );

    provider
      .observable()
      .filter(item => item.type === 'file' && item.details.processingStatus === 'succeeded')
      .map(item => ({
        mediaType: (item as FileItem).details.mediaType as MediaType
      })).subscribe({
        next: (item) => {
          const model: RendererModel = {
            type: 'SUCCESS',
            item
          };
          this.setState({ model });
        },
        error: (err) => {
          const model: RendererModel = {
            type: 'FAILED',
            err
          };
          this.setState({ model });
        }
      })
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
}
