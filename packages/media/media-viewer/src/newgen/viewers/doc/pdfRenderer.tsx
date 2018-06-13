import * as React from 'react';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { injectGlobal } from 'styled-components';
import { ZoomControls } from '../../zoomControls';
import { ErrorMessage, PDFWrapper } from '../../styled';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';

export const pdfViewerClassName = 'pdfViewer';

/* tslint:disable:no-unused-expression */
injectGlobal`
  .${pdfViewerClassName} {
    .page {
      margin: 1px auto -8px auto;
      border: 9px solid transparent;
      position: relative;

      .canvasWrapper {
        overflow: hidden;
      }

      .textLayer, .annotationLayer {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        line-height: 1;
      }
    }
  }
`;
/* tslint:enable:no-unused-expression */

pdfjsLib.GlobalWorkerOptions.workerSrc = '/'; // TODO: use web workers instead of fake worker.

const fetch = (url: string): Promise<Blob> => {
  return pdfjsLib.getDocument(url).promise;
};

export type Props = {
  src: string;
  onClose?: () => void;
};

export type State = {
  doc: Outcome<any, Error>;
  zoom: number;
};

const initialState: State = { zoom: 100, doc: { status: 'PENDING' } };

export class PDFRenderer extends React.Component<Props, State> {
  private el: HTMLDivElement;
  private pdfViewer: any;

  state: State = initialState;

  componentDidMount() {
    this.init();
  }

  private async init() {
    try {
      const doc = await fetch(this.props.src);
      this.setState({ doc: { status: 'SUCCESSFUL', data: doc } }, () => {
        this.pdfViewer = new PDFJSViewer.PDFViewer({ container: this.el });
        this.pdfViewer.setDocument(doc);
      });
    } catch (err) {
      this.setState({ doc: { status: 'FAILED', err } });
    }
  }

  private savePdfElement = el => {
    this.el = el;
  };

  private handleZoom = zoom => {
    this.pdfViewer.currentScale = zoom / 100;
    this.setState({ zoom });
  };

  render() {
    const { doc } = this.state;
    switch (doc.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return (
          <PDFWrapper innerRef={this.savePdfElement}>
            <div
              className={pdfViewerClassName}
              onClick={closeOnDirectClick(this.props.onClose)}
            />
            <ZoomControls zoom={this.state.zoom} onChange={this.handleZoom} />
          </PDFWrapper>
        );
      case 'FAILED':
        return <ErrorMessage>{doc.err.message}</ErrorMessage>;
    }
  }
}
