import * as React from 'react';
import { ComponentClass } from 'react';
import { PDFPreview } from '../../domain';
import { PDFWrapper } from '../../styled';
import pdfViewerLoader from './pdfLoader';

export type Props = {
  previewData: PDFPreview;
};

export type State = {
  PDFComponent?: ComponentClass<any>
}

export class PDFViewer extends React.PureComponent<Props, State> {

  state: State = { }

  componentDidMount() {
    this.loadPDFViewer(this.props)
  }

  componentWillReceiveProps(newProps: Props) {
    this.loadPDFViewer(newProps);
  }

  private loadPDFViewer = async (props: Props) => {
    const PDFComponent = await pdfViewerLoader();
    this.setState({ PDFComponent })
  };

  render () {
    const { PDFComponent } = this.state;
    const { previewData } = this.props;
    return (
      PDFComponent ?
        <PDFWrapper>
          <PDFComponent previewData={previewData}>
            <div className="pdfViewer" />
          </PDFComponent>
        </PDFWrapper> : null
    );
  }
}