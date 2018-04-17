import * as React from 'react';
import { mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import { FileItem } from '@atlaskit/media-core';
import { ItemViewer } from '../../src/newgen/item-viewer';
import { Model } from '../../src/newgen/domain';
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

describe('<ItemViewer />', () => {
  it('shows an indicator while loading', () => {
    const model: Model = {
      fileDetails: {
        status: 'PENDING',
      },
    };
    const el = mount(<ItemViewer model={model} context={createContext()} />);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows an error on failure', () => {
    const model: Model = {
      fileDetails: {
        status: 'FAILED',
        err: new Error('something went wrong'),
      },
    };
    const el = mount(<ItemViewer model={model} context={createContext()} />);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('shows an error if file is unsupported', () => {
    const item: FileItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'failed',
        mediaType: 'unknown',
      },
    };
    const model: Model = {
      fileDetails: {
        status: 'SUCCESSFUL',
        data: item,
      },
    };
    const el = mount(
      <ItemViewer model={model} item={item} context={createContext()} />,
    );
    expect(el.find(ErrorMessage).text()).toContain('unsupported');
  });

  it('should show the image viewer if media type is image', () => {
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
        data: item,
      },
    };
    const el = mount(
      <ItemViewer model={model} item={item} context={createContext()} />,
    );
    expect(el.find(ImageViewer)).toHaveLength(1);
  });

  it('should show the video viewer if media type is video', () => {
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
        data: item,
      },
    };
    const el = mount(
      <ItemViewer model={model} item={item} context={createContext()} />,
    );
    expect(el.find(VideoViewer)).toHaveLength(1);
  });

  it('should show the document viewer if media type is doc', () => {
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
        data: item,
      },
    };
    const el = mount(
      <ItemViewer model={model} item={item} context={createContext()} />,
    );
    expect(el.find(PDFViewer)).toHaveLength(1);
  });
});
