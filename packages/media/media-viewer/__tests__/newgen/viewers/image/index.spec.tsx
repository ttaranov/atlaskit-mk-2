import * as React from 'react';
import { mount } from 'enzyme';
import { ProcessedFileState } from '@atlaskit/media-core';
import { awaitError } from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { Stubs, createContext } from '../../../_stubs';
import {
  ImageViewer,
  REQUEST_CANCELLED,
} from '../../../../src/newgen/viewers/image';

import { ErrorMessage } from '../../../../src/newgen/error';

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

    expect(el.state().objectUrl.data).toBeDefined();
  });

  it('shows an error and download button when there is an error with the preview', async () => {
    const response = Promise.reject(new Error('test_error'));
    const { el } = createFixture(response);

    await awaitError(response, 'test_error');

    expect(el.state().objectUrl.err).toBeDefined();
    el.update();

    const errorMessage = el.find(ErrorMessage);

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      "We couldn't generate a preview for this file",
    );

    // download button
    expect(errorMessage.text()).toContain(
      'Try downloading the file to view it',
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
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

  it('restores initial state when new props are passed', async () => {
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    const revokeObjectUrl = jest.fn();
    (el as any).instance()['revokeObjectUrl'] = revokeObjectUrl;

    await response;
    expect(el.state().objectUrl.status).toEqual('SUCCESSFUL');

    const anotherImageItem: ProcessedFileState = {
      id: 'some-other-id',
      status: 'processed',
      name: 'my image',
      size: 11222,
      mediaType: 'image',
      mimeType: 'jpeg',
      artifacts: {},
    };

    el.setProps({ item: anotherImageItem });
    el.update();
    expect(revokeObjectUrl).toHaveBeenCalled();
    expect(el.state().objectUrl.status).toEqual('PENDING');
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
