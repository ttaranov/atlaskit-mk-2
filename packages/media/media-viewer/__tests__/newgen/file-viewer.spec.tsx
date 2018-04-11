jest.mock('pdfjs-dist/web/pdf_viewer', () => {
  return {
    PDFViewer: () => ({
      setDocument: () => {}
    })
  }
});
jest.mock('pdfjs-dist/build/pdf', () => {
  return {
    getDocument: () => ({
      promise: Promise.resolve()
    })
  }
});

import * as React from 'react';
import { mount } from 'enzyme';
import { FilePreview } from '../../src/newgen/domain';
import { FileViewer } from '../../src/newgen/file-viewer';
import { ImageViewer } from '../../src/newgen/viewers/image';
import { VideoViewer } from '../../src/newgen/viewers/video';
import { PDFViewer } from '../../src/newgen/viewers/pdf';

describe('<FileViewer />', () => {
  it('should show the image viewer if media type is image', () => {
    const preview: FilePreview = {
      viewer: 'IMAGE',
      objectUrl: '',
    };
    const el = mount(<FileViewer previewData={preview} />);
    expect(el.find(ImageViewer)).toHaveLength(1);
  });

  it('should show the video viewer if media type is image', () => {
    const preview: FilePreview = {
      viewer: 'VIDEO',
      src: '',
    };
    const el = mount(<FileViewer previewData={preview} />);
    expect(el.find(VideoViewer)).toHaveLength(1);
  });

  it('should show the pdf viewer if media type is document', () => {
    const preview: FilePreview = {
      viewer: 'PDF',
      doc: new Blob(),
    };
    const el = mount(<PDFViewer previewData={preview} />);
    expect(el.find(PDFViewer)).toHaveLength(1);
  });

});


jest.unmock('pdfjs-dist/build/pdf');
jest.unmock('pdfjs-dist/web/pdf_viewer');
