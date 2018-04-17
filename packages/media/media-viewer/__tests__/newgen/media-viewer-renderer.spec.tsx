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
import { MediaViewerRenderer } from '../../src/newgen/media-viewer-renderer';
import { Model, FileDetails } from '../../src/newgen/domain';
import { ErrorMessage } from '../../src/newgen/styled';
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
    };
    const el = mount(<MediaViewerRenderer model={model} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows an error on failure', () => {
    const model: Model = {
      fileDetails: {
        status: 'FAILED',
        err: new Error('something went wrong'),
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
    };
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'failed',
        mediaType: 'unknown',
      },
    };
    const context = createContext();
    const el = mount(
      <MediaViewerRenderer model={model} item={item} context={context} />,
    );
    expect(el.find(ErrorMessage).text()).toContain('unsupported');
  });

  it('should show the image viewer if media type is image', () => {
    const context = createContext();
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'image',
      },
    };
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: {
          mediaType: 'image',
        },
      },
    };
    const el = mount(
      <MediaViewerRenderer model={model} context={context} item={item} />,
    );
    expect(el.find(ImageViewer)).toHaveLength(1);
  });

  it('should show the video viewer if media type is video', () => {
    const context = createContext();
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'video',
      },
    };
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: {
          mediaType: 'video',
        },
      },
    };
    const el = mount(
      <MediaViewerRenderer model={model} context={context} item={item} />,
    );
    expect(el.find(VideoViewer)).toHaveLength(1);
  });

  it('should show the document viewer if media type is doc', () => {
    const context = createContext();
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'doc',
      },
    };
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: {
          mediaType: 'doc',
        },
      },
    };
    const el = mount(
      <MediaViewerRenderer model={model} context={context} item={item} />,
    );
    expect(el.find(PDFViewer)).toHaveLength(1);
  });
});

jest.unmock('pdfjs-dist/build/pdf');
jest.unmock('pdfjs-dist/web/pdf_viewer');
