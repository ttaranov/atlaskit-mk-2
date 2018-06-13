import * as React from 'react';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { injectGlobal } from 'styled-components';
import { ZoomControls } from '../../zoomControls';
import { PDFWrapper } from '../../styled';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { Outcome } from '../../domain';

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

      .textLayer {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        line-height: 1;
        font-family: sans-serif;
        opacity: 0.8;
        
        ::selection {
          background: rgb(0,0,255);
        }
      }
      
      .annotationLayer {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      
      .textLayer > div, .annotationLayer > section {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
      }
      .linkAnnotation > a {
        position: absolute;
        font-size: 1em;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .linkAnnotation > a {
        background: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") 0 0 repeat;
      }

      .linkAnnotation > a:hover {
        opacity: 0.2;
        background: #ff0;
        box-shadow: 0 2px 10px #ff0;
      }
    }
  }
`;
/* tslint:enable:no-unused-expression */

pdfjsLib.GlobalWorkerOptions.workerSrc = '/'; // TODO: use web workers instead of fake worker.

const fetch = async (url: string): Promise<Blob> => {
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

export class PDFRenderer extends React.PureComponent<Props, State> {
  private el: HTMLDivElement;
  private pdfViewer: any;

  state: State = initialState;

  componentDidMount() {
    this.init();
  }

  private async init() {
    this.pdfViewer = new PDFJSViewer.PDFViewer({ container: this.el });
    try {
      const doc = await fetch(this.props.src);
      this.setState({ doc: { status: 'SUCCESSFUL', data: doc } });
      this.pdfViewer.setDocument(doc);
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
    return (
      <div>
        <PDFWrapper innerRef={this.savePdfElement}>
          <div
            className={pdfViewerClassName}
            onClick={closeOnDirectClick(this.props.onClose)}
          />
        </PDFWrapper>
        <ZoomControls zoom={this.state.zoom} onChange={this.handleZoom} />
      </div>
    );
  }
}
