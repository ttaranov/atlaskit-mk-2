import {
  setState as setInteractiveImgState,
  InteractiveImg as InteractiveImgMock,
} from '../../../../mocks/_interactive-img';

jest.mock('../../../../../newgen/viewers/image/interactive-img', () => ({
  InteractiveImg: InteractiveImgMock,
}));

import * as React from 'react';
import { mount } from 'enzyme';
import { ProcessedFileState } from '@atlaskit/media-core';
import { awaitError } from '@atlaskit/media-test-helpers';
import { ImageViewer } from '../../../../../newgen/viewers/image';
import { Stubs, createContext } from '../../../_stubs';

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

export function createFixture(
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

describe('ImageViewer analytics', () => {
  it('should call onLoad with success', async () => {
    setInteractiveImgState('success');
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;
    expect(el.prop('onLoad')).toHaveBeenCalledWith({ status: 'success' });
  });

  it('should call onLoad with error if interactive-img fails', async () => {
    setInteractiveImgState('error');
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;
    expect(el.prop('onLoad')).toHaveBeenCalledWith({
      status: 'error',
      errorMessage: 'Interactive-img render failed',
    });
  });

  it('should call onLoad with error if there is an error fetching metadata', async () => {
    const response = Promise.reject(new Error('test_error'));
    const { el } = createFixture(response);

    await awaitError(response, 'test_error');
    expect(el.prop('onLoad')).toHaveBeenCalledWith({
      status: 'error',
      errorMessage: 'test_error',
    });
  });
});
