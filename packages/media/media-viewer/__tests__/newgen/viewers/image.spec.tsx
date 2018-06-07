import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { FileItem } from '@atlaskit/media-core';
import Button from '@atlaskit/button';
import { Stubs } from '../../_stubs';
import {
  ImageViewer,
  REQUEST_CANCELLED,
} from '../../../src/newgen/viewers/image';
import { ZoomControls } from '../../../src/newgen/zoomControls';

const collectionName = 'some-collection';
const imageItem: FileItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'image',
  },
};

function createContext(blobService?) {
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
    Stubs.mediaItemProvider(new Subject<FileItem>()),
    blobService,
  ) as any;
}

function createFixture(fetchImageBlobCancelableResponse, cancel?) {
  const blobService = Stubs.blobService();
  blobService.fetchImageBlobCancelable.mockReturnValue({
    response: fetchImageBlobCancelableResponse || Promise.resolve(new Blob()),
    cancel: cancel || jest.fn(),
  });
  const context = createContext(blobService);
  const onClose = jest.fn();
  const el = mount(
    <ImageViewer
      context={context}
      item={imageItem}
      collectionName={collectionName}
      onClose={onClose}
    />,
  );
  return { blobService, context, el, onClose };
}

async function awaitError(response, expectedMessage) {
  try {
    await response;
  } catch (err) {
    if (err.message !== expectedMessage) {
      throw err;
    }
  }
}

describe('ImageViewer', () => {
  it('assigns an object url for images when successful', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;

    expect(el.state().objectUrl.data).toBeDefined();
  });

  it('shows an error when the image could not be fetched', async () => {
    const response = Promise.reject(new Error('test_error'));
    const { el } = createFixture(response);

    await awaitError(response, 'test_error');

    expect(el.state().objectUrl.err).toBeDefined();
  });

  it('does not update state when image fetch request is cancelled', async () => {
    const response = Promise.reject(new Error(REQUEST_CANCELLED));
    const { el } = createFixture(response);

    el.instance()['preventRaceCondition'] = jest.fn();

    await awaitError(response, REQUEST_CANCELLED);

    expect(el.instance()['preventRaceCondition'].mock.calls.length === 1);
  });

  it('cancels an image fetch request when unmounted', () => {
    const response = new Promise(() => {});
    const cancel = jest.fn();
    const { el } = createFixture(response, cancel);

    el.unmount();

    expect(cancel).toHaveBeenCalled();
  });

  it('revokes an existing object url when unmounted', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    const revokeObjectUrl = jest.fn();
    el.instance()['revokeObjectUrl'] = revokeObjectUrl;

    await response;
    el.unmount();

    expect(revokeObjectUrl).toHaveBeenCalled();
  });

  it('restores initial state when new props are passed', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    const revokeObjectUrl = jest.fn();
    el.instance()['revokeObjectUrl'] = revokeObjectUrl;

    await response;
    expect(el.state().objectUrl.status).toEqual('SUCCESSFUL');

    const anotherImageItem: FileItem = {
      type: 'file',
      details: {
        id: 'some-other-id',
        processingStatus: 'succeeded',
        mediaType: 'image',
      },
    };

    el.setProps({ item: anotherImageItem });
    el.update();
    expect(revokeObjectUrl).toHaveBeenCalled();
    expect(el.state().objectUrl.status).toEqual('PENDING');
  });

  it('it allows zooming', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;

    el.update();

    expect(el.state('zoom')).toEqual(100);
    expect(el.find(ZoomControls)).toHaveLength(1);
    el
      .find(ZoomControls)
      .find(Button)
      .first()
      .simulate('click');
    expect(el.state('zoom')).toEqual(50);
    el
      .find(ZoomControls)
      .find(Button)
      .last()
      .simulate('click');
    expect(el.state('zoom')).toEqual(100);
  });

  it('MSW-720: creates the blobService with collectionName', async () => {
    const response = Promise.resolve(new Blob());
    const { el, context } = createFixture(response);

    await response;
    el.update();

    expect(context.getBlobService).toHaveBeenCalledWith(collectionName);
  });

  it('MSW-700: clicking on background of ImageViewer does not close it', async () => {
    const response = Promise.resolve(new Blob());
    const { el, onClose } = createFixture(response);

    await response;
    el.simulate('click');

    expect(onClose).toHaveBeenCalled();
  });
});
