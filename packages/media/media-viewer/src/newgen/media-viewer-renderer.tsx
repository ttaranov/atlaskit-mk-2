import * as React from 'react';
import { Observable } from 'rxjs';
import { FileViewer, FileDetails } from './file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

export type DataSource = Observable<FileDetails | null>;

export type RendererProps = {
  dataSource: DataSource;
};

export type RendererState = {
  item: FileDetails | null;
};

export class MediaViewerRenderer extends React.Component<
  RendererProps,
  RendererState
> {
  state: RendererState = { item: null };

  componentDidMount() {
    const { dataSource } = this.props;
    dataSource.subscribe({
      next: (item: FileDetails) => {
        this.setState({ item });
      },
    });
  }

  render() {
    if (this.state.item) {
      return <FileViewer fileDetails={this.state.item} />;
    } else {
      return (
        <ErrorMessage>
          No items provided.
        </ErrorMessage>
      );
    }
  }
}
