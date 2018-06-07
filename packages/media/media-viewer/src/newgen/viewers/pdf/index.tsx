import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { Outcome } from '../../domain';
import { PDFWrapper, ErrorMessage } from '../../styled';
import { Spinner } from '../../loading';
import { componentLoader } from './loader';
import { constructAuthTokenUrl } from '../../util';
import { fetch } from './loader';

export type Props = {
  context: Context;
  item: FileItem;
  collectionName?: string;
  onClose?: () => void;
};

export type State = {
  doc: Outcome<any, Error>;
};

export class PDFViewer extends React.PureComponent<Props, State> {
  static PDFComponent;

  state: State = {
    doc: { status: 'PENDING' },
  };

  componentDidMount() {
    this.init();
  }

  private async init() {
    if (!PDFViewer.PDFComponent) {
      await this.loadPDFViewer(this.props);
    }

    const { item, context, collectionName } = this.props;

    const pdfArtifactUrl = getPDFUrl(item);
    if (!pdfArtifactUrl) {
      this.setState({
        doc: {
          status: 'FAILED',
          err: new Error('no artifacts found for this file'),
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
      const data = await this.fetch(src);
      this.setState({
        doc: {
          status: 'SUCCESSFUL',
          data: data,
        },
      });
    } catch (err) {
      this.setState({
        doc: {
          status: 'FAILED',
          err,
        },
      });
    }
  }

  private async loadPDFViewer(props: Props) {
    PDFViewer.PDFComponent = await componentLoader();
    this.forceUpdate();
  }

  render() {
    const { onClose } = this.props;
    const { PDFComponent } = PDFViewer;
    const { doc } = this.state;

    if (!PDFComponent) {
      return null;
    }

    switch (doc.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return (
          <PDFWrapper>
            <PDFComponent doc={doc.data} onClose={onClose} />
          </PDFWrapper>
        );
      case 'FAILED':
        return <ErrorMessage>{doc.err.message}</ErrorMessage>;
    }
  }

  public fetch(src: string): Promise<any> {
    return fetch(src);
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
