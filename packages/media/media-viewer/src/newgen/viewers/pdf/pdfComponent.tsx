import * as React from 'react';
import { PDFWrapper } from '../../styled';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { ZoomControls } from '../../zoomControls';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/'; // TODO: use web workers instead of fake worker.

export type Props = {
  doc: any;
};

export const fetch = async (url: string): Promise<Blob> => {
  return pdfjsLib.getDocument(url).promise;
};

export class PDFViewer extends React.PureComponent<Props, { scale: number }> {
  private el: HTMLDivElement;
  private pdfViewer: any;

  constructor() {
    super();
    this.state = { scale: 1 };
  }

  componentDidMount() {
    this.pdfViewer = new PDFJSViewer.PDFViewer({ container: this.el });
    this.pdfViewer.setDocument(this.props.doc);
  }

  private savePdfElement = el => {
    this.el = el;
  };

  private handleZoom = scale => {
    this.pdfViewer.currentScale = scale;
    this.setState({ scale: scale });
  };

  render() {
    return (
      <PDFWrapper innerRef={this.savePdfElement}>
        <div className="pdfViewer" />
        <ZoomControls zoomLevel={this.state.scale} onChange={this.handleZoom} />
      </PDFWrapper>
    );
  }
}
