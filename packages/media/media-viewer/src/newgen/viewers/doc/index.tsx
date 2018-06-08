import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { Outcome } from '../../domain';
import { ErrorMessage } from '../../styled';
import { Spinner } from '../../loading';
import { constructAuthTokenUrl } from '../../util';
import { Props as RendererProps } from './pdfRenderer';

const moduleLoader = () =>
  import(/* webpackChunkName:"@atlaskit-internal_media-viewer-pdf-viewer" */ './pdfRenderer');

const componentLoader: () => Promise<
  React.ComponentClass<RendererProps>
> = () => moduleLoader().then(module => module.PDFRenderer);

export type Props = {
  context: Context;
  item: FileItem;
  collectionName?: string;
  onClose?: () => void;
};

export type State = {
  src: Outcome<string, Error>;
};

const initialState: State = {
  src: { status: 'PENDING' },
};

export class DocViewer extends React.PureComponent<Props, State> {
  static PDFComponent;

  state: State = initialState;

  componentDidMount() {
    this.init();
  }

  private async init() {
    if (!DocViewer.PDFComponent) {
      await this.loadDocViewer(this.props);
    }
    const { item, context, collectionName } = this.props;

    const pdfArtifactUrl = getPDFUrl(item);
    if (!pdfArtifactUrl) {
      this.setState({
        src: {
          status: 'FAILED',
          err: new Error('no pdf artifacts found for this file'),
        },
      });
      return;
    }
    try {
      const src = await constructAuthTokenUrl(
        pdfArtifactUrl,
        context,
        collectionName,
      );
      this.setState({
        src: {
          status: 'SUCCESSFUL',
          data: src,
        },
      });
    } catch (err) {
      this.setState({
        src: {
          status: 'FAILED',
          err,
        },
      });
    }
  }

  private async loadDocViewer(props: Props) {
    DocViewer.PDFComponent = await componentLoader();
    this.forceUpdate();
  }

  render() {
    const { onClose } = this.props;
    const { PDFComponent } = DocViewer;
    const { src } = this.state;

    if (!PDFComponent) {
      return <Spinner />;
    }

    switch (src.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return <PDFComponent src={src.data} onClose={onClose} />;
      case 'FAILED':
        return <ErrorMessage>{src.err.message}</ErrorMessage>;
    }
  }
}

function getPDFUrl(fileItem: FileItem) {
  const artifact = 'document.pdf';
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
