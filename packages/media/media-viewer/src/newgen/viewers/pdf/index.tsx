import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { Outcome } from '../../domain';
import { PDFWrapper, ErrorMessage } from '../../styled';
import { Spinner } from '../../loading';
import { componentLoader } from './loader';
import { constructAuthTokenUrl } from '../../util';

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

export class PDFViewer extends React.PureComponent<Props, State> {
  static PDFComponent;

  state: State = initialState;

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

  private async loadPDFViewer(props: Props) {
    PDFViewer.PDFComponent = await componentLoader();
    this.forceUpdate();
  }

  render() {
    const { onClose } = this.props;
    const { PDFComponent } = PDFViewer;
    const { src } = this.state;

    if (!PDFComponent) {
      return <Spinner />;
    }

    switch (src.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return (
          <PDFWrapper>
            <PDFComponent src={src.data} onClose={onClose} />
          </PDFWrapper>
        );
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
