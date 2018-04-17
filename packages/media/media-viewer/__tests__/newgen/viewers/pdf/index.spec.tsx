import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import { Stubs } from '../../../_stubs';
import { MediaViewer } from '../../../../src/newgen/media-viewer';
import { MediaViewerRenderer } from '../../../../src/newgen/media-viewer-renderer';

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

function createContext(subject, blobService?) {
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

function createFixture(identifier) {
  const subject = new Subject<MediaItem>();
  const blobService = Stubs.blobService();
  const context = createContext(subject, blobService);
  const onClose = jest.fn();
  const el = mount(
    <MediaViewer data={identifier} context={context} onClose={onClose} />,
  );
  return { blobService, subject, context, el, onClose };
}

function getModel(el) {
  return el.find(MediaViewerRenderer).props().model;
}

describe.skip('PDFViewer', () => {
  it('assigns a document object for pdf when successful', async () => {
    const docItem: MediaItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'doc',
        artifacts: {
          'document.pdf': {
            url: '/pdf',
          },
        },
      },
    };
    const { subject, el } = createFixture(identifier);

    subject.next(docItem);

    await waitUntil(() => {
      el.update();
      return getModel(el).previewData.status === 'SUCCESSFUL';
    }, 5);

    expect(getModel(el)).toMatchObject({
      previewData: {
        status: 'SUCCESSFUL',
        data: {
          viewer: 'PDF',
        },
      },
    });
  });

  it('shows an error if no pdf artifact found', async () => {
    const docItem: MediaItem = {
      type: 'file',
      details: {
        id: 'some-id',
        processingStatus: 'succeeded',
        mediaType: 'doc',
        artifacts: {},
      },
    };
    const { subject, el } = createFixture(identifier);

    subject.next(docItem);

    await waitUntil(() => {
      el.update();
      return getModel(el).previewData.status === 'FAILED';
    }, 5);

    expect(getModel(el)).toMatchObject({
      previewData: {
        status: 'FAILED',
        err: new Error('no pdf artifacts found for this file'),
      },
    });
  });
});
