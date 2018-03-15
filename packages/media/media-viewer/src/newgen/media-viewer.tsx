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
    console.log('---- WHY NO US?');
    const { dataSource } = this.props;
    dataSource.subscribe({
      next: (items: FileDetails[]) => {
        console.log('---- IN component');
        this.setState({ items });
      },
    });
  }

  render() {
    return <FileViewer fileDetails={this.state.items[0]} />;
  }
}
