import * as React from 'react';
import { PDFPreview } from '../../domain';
import { PDFWrapper } from '../../styled';
import pdfViewerLoader from './pdfLoader';

export type Props = {
  previewData: PDFPreview;
};

export class PDFViewer extends React.PureComponent<Props, {}> {
  static PDFComponent;

  componentDidMount() {
    if (!PDFViewer.PDFComponent) {
      this.loadPDFViewer(this.props);
    }
  }

  private loadPDFViewer = async (props: Props) => {
    PDFViewer.PDFComponent = await pdfViewerLoader();
    this.forceUpdate();
  };

  render() {
    const { PDFComponent } = PDFViewer;
    const { previewData } = this.props;
    return PDFComponent ? (
      <PDFWrapper>
        <PDFComponent previewData={previewData}>
          <div className="pdfViewer" />
        </PDFComponent>
      </PDFWrapper>
    ) : null;
  }
}
