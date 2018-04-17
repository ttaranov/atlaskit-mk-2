import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { PDFPreview, Outcome } from '../../domain';
import { PDFWrapper } from '../../styled';
import { componentLoader } from './loader';

export type Props = {
  previewData: PDFPreview;
  context: Context;
  item: FileItem;
  collectionName?: string;
};

export type State = {
  src: Outcome<string, Error>;
};

export class PDFViewer extends React.PureComponent<Props, State> {
  static PDFComponent;

  state: State = {
    src: { status: 'PENDING' },
  };

  componentDidMount() {
    if (!PDFViewer.PDFComponent) {
      this.loadPDFViewer(this.props);
    }
  }

  private loadPDFViewer = async (props: Props) => {
    PDFViewer.PDFComponent = await componentLoader();
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
