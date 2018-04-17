import * as React from 'react';
import { PDFPreview } from '../../domain';
import { PDFWrapper } from '../../styled';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/'; // TODO: use web workers instead of fake worker.

export type Props = {
  previewData: PDFPreview;
};

export const fetch = async (url: string): Promise<Blob> => {
  return pdfjsLib.getDocument(url).promise;
};

export class PDFViewer extends React.PureComponent<Props, {}> {
  private el: HTMLDivElement;
  private pdfViewer: any;

  componentDidMount() {
    this.pdfViewer = new PDFJSViewer.PDFViewer({ container: this.el });
    this.pdfViewer.setDocument(this.props.previewData.doc);
  }

  private savePdfElement = el => {
    this.el = el;
  };

  render() {
    return (
      <PDFWrapper innerRef={this.savePdfElement}>
        <div className="pdfViewer" />
      </PDFWrapper>
    );
  }
}
