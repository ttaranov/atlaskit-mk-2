import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Context, MediaItemType } from '@atlaskit/media-core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { FileViewer, FileDetails } from './file-viewer';
import { MediaViewerRenderer, DataSource } from './media-viewer-renderer';

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
  dataSource?: DataSource;
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = {};

  componentDidMount() {
    const { id, type, occurrenceKey, collectionName } = this.props.data;
    const provider = this.props.context.getMediaItemProvider(
      id,
      type,
      collectionName,
    );

    this.setState({
      dataSource: provider
        .observable()
        .filter(item => item.details.processingState === 'succeeded')
        .map(item => item),
    });
  }

  render() {
    const { onClose } = this.props;
    const { dataSource } = this.state;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        {dataSource && <MediaViewerRenderer dataSource={dataSource} />}
      </div>
    );
  }
}
