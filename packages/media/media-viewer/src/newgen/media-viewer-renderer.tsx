import * as React from 'react';
import { Observable } from 'rxjs';
import { FileViewer, FileDetails } from './file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

export type DataSource = {
  left: FileDetails[],
  center: FileDetails,
  right: FileDetails[]
}
export type DataSource = Observable<FileDetails[]>;

export type RendererProps = {
  dataSource: DataSource;
  selected: FileDetails;
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
      return (
        <ErrorMessage>
          No items provided.
        </ErrorMessage>
      );
    }
  }
}
