import * as React from 'react';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { injectGlobal } from 'styled-components';
import { ZoomControls } from '../../zoomControls';
import { PDFWrapper } from '../../styled';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';

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

export const fetch = async (url: string): Promise<Blob> => {
  return pdfjsLib.getDocument(url).promise;
};

export type Props = {
  doc: any;
  onClose?: () => void;
};

export type State = {
  step: number;
  zoomLevel: number;
};

const initialState: State = { step: 4, zoomLevel: 100 };

export class PDFViewer extends React.PureComponent<Props, State> {
  private el: HTMLDivElement;
  private pdfViewer: any;

  state: State = initialState;

  componentDidMount() {
    this.pdfViewer = new PDFJSViewer.PDFViewer({ container: this.el });
    this.pdfViewer.setDocument(this.props.doc);
  }

  private savePdfElement = el => {
    this.el = el;
  };

  private handleZoom = (step, zoomLevel) => {
    this.pdfViewer.currentScale = zoomLevel;
    this.setState({ step, zoomLevel });
  };

  render() {
    return (
      <div>
        <PDFWrapper innerRef={this.savePdfElement}>
          <div
            className={pdfViewerClassName}
            onClick={closeOnDirectClick(this.props.onClose)}
          />
        </PDFWrapper>
        <ZoomControls
          minZoom={0.2}
          maxZoom={5}
          steps={10}
          step={this.state.step}
          onChange={this.handleZoom}
        />
      </div>
    );
  }
}
