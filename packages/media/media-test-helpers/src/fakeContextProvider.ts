import * as sinon from 'sinon';
import { Observable } from 'rxjs';
import { Context } from '@atlaskit/media-core';

export const fakeContext = (stubbedContext = {}): Context => {
  const getMediaItemProvider = sinon
    .stub()
    .returns({ observable: sinon.stub().returns(Observable.of('nothing')) });

  const getMediaCollectionProvider = sinon
    .stub()
    .returns({ observable: sinon.stub().returns(Observable.of('nothing')) });

  const getDataUriService = sinon.stub().returns({
    fetchOriginalDataUri: sinon
      .stub()
      .returns(Promise.resolve('fake-original-data-uri')),
    fetchImageDataUri: sinon
      .stub()
      .returns(Promise.resolve('fake-image-data-uri')),
  });

  const addLinkItem = sinon
    .stub()
    .returns({ observable: sinon.stub().returns(Observable.of('nothing')) });

  const getUrlPreviewProvider = sinon
    .stub()
    .returns({ observable: sinon.stub().returns(Observable.of('nothing')) });

  const getBlobService = sinon.stub().returns({
    fetchOriginalBlob: sinon
      .stub()
      .returns(Promise.resolve(new Blob())),
    fetchImageBlob: sinon
      .stub()
      .returns(Promise.resolve(new Blob())),
  })

  const defaultContext: Context = {
    getMediaItemProvider,
    getMediaCollectionProvider,
    getDataUriService,
    getBlobService,
    addLinkItem,
    getUrlPreviewProvider,
    refreshCollection: sinon.spy(),
    config: {
      serviceHost: 'some-service-host',
      authProvider: () =>
        Promise.resolve({
          clientId: 'some-client-id',
          token: 'some-token',
        }),
    },
  };

  const wrappedStubbedContext = {};
  Object.keys(stubbedContext).forEach(methodName => {
    wrappedStubbedContext[methodName] = sinon
      .stub()
      .returns(stubbedContext[methodName]);
  });

  return {
    ...defaultContext,
    ...wrappedStubbedContext,
  };
};
