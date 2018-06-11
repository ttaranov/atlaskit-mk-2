import * as React from 'react';
import { mount } from 'enzyme';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import Button from '@atlaskit/button';
import {
  PDFRenderer,
  pdfViewerClassName,
} from '../../../../src/newgen/viewers/doc/pdfRenderer';
import { ZoomControls } from '../../../../src/newgen/zoomControls';
import { Spinner } from '../../../../src/newgen/loading';
import { ErrorMessage } from '../../../../src/newgen/styled';

function createFixture(documentPromise) {
  const onClose = jest.fn();
  pdfjsLib.getDocument = jest.fn(() => ({
    promise: documentPromise,
  }));
  PDFJSViewer.PDFViewer = jest.fn(() => {
    return {
      setDocument: jest.fn(),
    };
  });
  const el = mount(<PDFRenderer src={''} onClose={onClose} />);
  return { el, onClose };
}

describe('PDFRenderer', () => {
  let originalGetDocument;
  let originalViewer;
  beforeEach(() => {
    originalGetDocument = pdfjsLib.getDocument;
    originalViewer = PDFJSViewer.PDFViewer;
  });
  afterEach(() => {
    pdfjsLib.getDocument = originalGetDocument;
    PDFJSViewer.PDFViewer = originalViewer;
  });

  it('supports zooming', async () => {
    const documentPromise = Promise.resolve({});
    const { el } = createFixture(documentPromise);
    await documentPromise;
    el.update();

    expect(el.state('zoom')).toEqual(100);
    expect(el.state('doc').status).toEqual('SUCCESSFUL');
    expect(el.find(ZoomControls)).toHaveLength(1);
    el
      .find(ZoomControls)
      .find(Button)
      .first()
      .simulate('click');
    expect(el.state('zoom')).toBeLessThan(100);
  });

  it('shows a loading indicator until the document is ready', () => {
    const unresolvedDocumentPromise = new Promise(() => {});
    const { el } = createFixture(unresolvedDocumentPromise);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows an error message when the document could not be loaded', async () => {
    const failedDocumentPromise = Promise.reject(new Error('test'));
    const { el } = createFixture(failedDocumentPromise);

    // wait for promise rejection ignoring the error
    await failedDocumentPromise.catch(() => {});
    el.update();
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('MSW-700: clicking on background of DocViewer does not close it', async () => {
    const documentPromise = Promise.resolve({});
    const { el, onClose } = createFixture(documentPromise);
    await documentPromise;
    el.update();

    el.find(`.${pdfViewerClassName}`).simulate('click');

    expect(onClose).toHaveBeenCalled();
  });
});
