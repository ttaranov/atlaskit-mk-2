import * as React from 'react';
import { Observable } from 'rxjs';
import Spinner from '@atlaskit/spinner';
import { FileViewer, FileDetails } from './file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

export type DataSource = Observable<FileDetails>;

export type RendererProps = {
  dataSource: DataSource;
};

export type RendererState =
  | {
      type: 'LOADING';
    }
  | {
      type: 'SUCCESS';
      item: FileDetails;
    }
  | {
      type: 'FAILED';
      err: Error;
    };

export class MediaViewerRenderer extends React.Component<
  RendererProps,
  RendererState
> {
  state: RendererState = { type: 'LOADING' };

  componentDidMount() {
    const { dataSource } = this.props;
    dataSource.subscribe({
      next: (item: FileDetails) => {
        this.setState({ type: 'SUCCESS', item });
      },
      error: (err: Error) => {
        this.setState({ type: 'FAILED', err });
      },
    });
  }

  render() {
    switch (this.state.type) {
      case 'LOADING':
        return <Spinner />;
      case 'SUCCESS':
        console.log(this.state.item);

        return <FileViewer fileDetails={this.state.item} />;
      case 'FAILED':

        return <ErrorMessage>Error</ErrorMessage>;
    }
  }
}
