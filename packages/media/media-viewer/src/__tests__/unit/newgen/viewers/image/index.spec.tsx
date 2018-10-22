import * as React from 'react';
import { mount } from 'enzyme';
import { ProcessedFileState } from '@atlaskit/media-core';
import { awaitError } from '@atlaskit/media-test-helpers';
import { Stubs, createContext } from '../../../_stubs';
import {
  ImageViewer,
  REQUEST_CANCELLED,
} from '../../../../../newgen/viewers/image';

const collectionName = 'some-collection';
const imageItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my image',
  size: 11222,
  mediaType: 'image',
  mimeType: 'jpeg',
  artifacts: {},
};

function createFixture(
  fetchImageBlobCancelableResponse: Promise<Blob>,
  cancel?: Function,
) {
  const blobService = Stubs.blobService();
  blobService.fetchImageBlobCancelable.mockReturnValue({
    response: fetchImageBlobCancelableResponse || Promise.resolve(new Blob()),
    cancel: cancel || jest.fn(),
  });
  const context = createContext({ blobService });
  const onClose = jest.fn();
  const onLoaded = jest.fn();
  const el = mount(
    <ImageViewer
      context={context}
      item={imageItem}
      collectionName={collectionName}
      onClose={onClose}
      onLoad={onLoaded}
    />,
  );
  return { blobService, context, el, onClose };
}

describe('ImageViewer', () => {
  it('assigns an object url for images when successful', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;

    expect(el.state().content.data).toBeDefined();
  });

  it('does not update state when image fetch request is cancelled', async () => {
    const response = Promise.reject(new Error(REQUEST_CANCELLED));
    const { el } = createFixture(response);

    (el as any).instance()['preventRaceCondition'] = jest.fn();

    await awaitError(response, REQUEST_CANCELLED);

    expect(
      (el as any).instance()['preventRaceCondition'].mock.calls.length === 1,
    );
  });

  it('cancels an image fetch request when unmounted', () => {
    const response: any = new Promise(() => {});
    const cancel = jest.fn();
    const { el } = createFixture(response, cancel);

    el.unmount();

    expect(cancel).toHaveBeenCalled();
  });

  it('revokes an existing object url when unmounted', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    const revokeObjectUrl = jest.fn();
    (el as any).instance()['revokeObjectUrl'] = revokeObjectUrl;

    await response;
    el.unmount();

    expect(revokeObjectUrl).toHaveBeenCalled();
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
