import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { FileViewer, FileDetails } from './file-viewer';

export type Props = {
  onClose?: () => void;
};

const fileDetails: FileDetails = {
  mediaType: 'unknown',
};

export class MediaViewer extends React.Component<Props, {}> {
  render() {
    const { onClose } = this.props;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <FileViewer fileDetails={fileDetails} />
      </div>
    );
  }
}

export type DataSource = Observable<FileDetails[]>;

export type RendererProps = {
  dataSource: DataSource;
};

export type RendererState = {
  items: FileDetails[];
};

export class MediaViewerRenderer extends React.Component<
  RendererProps,
  RendererState
> {
  state: RendererState = { items: [] };

  componentDidMount() {
    const { dataSource } = this.props;
    dataSource.subscribe({
      next: (items: FileDetails[]) => {
        this.setState({ items });
      },
    });
  }

  render() {
    if (this.state.items.length) {
      return <FileViewer fileDetails={this.state.items[0]} />;
    } else {
      return null;
    }
  }
}
