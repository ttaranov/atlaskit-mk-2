import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { FileItem, MediaItemType } from '@atlaskit/media-core';
import { Stubs } from '../../_stubs';
import { ImageViewer } from '../../../src/newgen/viewers/image';

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

const imageItem: FileItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'image',
  },
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
  const subject = new Subject<FileItem>();
  const blobService = Stubs.blobService();
  const context = createContext(subject, blobService);
  const el = mount(<ImageViewer context={context} item={imageItem} />);
  return { blobService, subject, context, el };
}

describe('ImageViewer', () => {
  it('revokes an existing object url when unmounted', async () => {
    const { subject, el, blobService } = createFixture(identifier);

    const response = Promise.resolve(new Blob());
    blobService.fetchImageBlobCancelable.mockReturnValueOnce({
      response,
      cancel: jest.fn(),
    });

    const revokeObjectUrl = jest.fn();
    el.instance()['revokeObjectUrl'] = revokeObjectUrl;

    subject.next(imageItem);

    await response;
    el.unmount();

    expect(revokeObjectUrl).toHaveBeenCalled();
  });
});
