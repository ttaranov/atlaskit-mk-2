jest.mock('pdfjs-dist/web/pdf_viewer', () => {
  return {
    PDFViewer: () => ({
      setDocument: () => {},
    }),
  };
});
jest.mock('pdfjs-dist/build/pdf', () => {
  return {
    getDocument: () => ({
      promise: Promise.resolve(),
    }),
  };
});

import * as React from 'react';
import { mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import { FileItem } from '@atlaskit/media-core';
import {
  MediaViewerRenderer,
  FileViewer,
} from '../../src/newgen/media-viewer-renderer';
import { Model, FileDetails } from '../../src/newgen/domain';
import { ErrorMessage } from '../../src/newgen/styled';
import { FilePreview } from '../../src/newgen/domain';
import { ImageViewer } from '../../src/newgen/viewers/image';
import { VideoViewer } from '../../src/newgen/viewers/video';
import { PDFViewer } from '../../src/newgen/viewers/pdf';
import { Stubs } from '../_stubs';

function createContext(subject?, blobService?) {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
  const contextConfig = {
    serviceHost,
    authProvider,
  };
  return Stubs.context(
    contextConfig,
    undefined,
    subject && Stubs.mediaItemProvider(subject),
    blobService,
  ) as any;
}

describe('<MediaViewerRenderer />', () => {
  const fileDetails: FileDetails = { mediaType: 'doc' };

  it('shows an indicator while loading', () => {
    const model: Model = {
      fileDetails: {
        status: 'PENDING',
      },
      previewData: {
        status: 'PENDING',
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a viewer when file details were loaded successfully', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: fileDetails,
      },
      previewData: {
        status: 'SUCCESSFUL',
        data: {
          viewer: 'IMAGE',
        },
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    const fv = el.find(FileViewer);
    expect(fv).toHaveLength(1);
  });

  it('shows an error when preview failed to load', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: fileDetails,
      },
      previewData: {
        status: 'FAILED',
        err: new Error(''),
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    const err = el.find(ErrorMessage);
    expect(err.text()).toContain('Error rendering preview');
  });

  it('shows a loading UI when preview is loading', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: fileDetails,
      },
      previewData: {
        status: 'PENDING',
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    const spinner = el.find(Spinner);
    expect(spinner).toHaveLength(1);
  });

  it('shows an error on failure', () => {
    const model: Model = {
      fileDetails: {
        status: 'FAILED',
        err: new Error('something went wrong'),
      },
      previewData: {
        status: 'PENDING',
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('shows an error if file is unsupported', () => {
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: {
          mediaType: 'unknown',
        },
      },
      previewData: {
        status: 'PENDING',
      },
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(ErrorMessage).text()).toContain('unsupported');
  });
});

describe('<FileViewer />', () => {
  it('should show the image viewer if media type is image', () => {
    const preview: FilePreview = {
      viewer: 'IMAGE',
    };
    const context = createContext();
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'failed',
        mediaType: 'image',
      },
    };
    const el = mount(
      <FileViewer previewData={preview} context={context} item={item} />,
    );
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
