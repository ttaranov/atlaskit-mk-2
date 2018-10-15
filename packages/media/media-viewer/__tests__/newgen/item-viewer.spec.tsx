import * as React from 'react';
import { Observable } from 'rxjs';
import { mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import { MediaItemType, Context } from '@atlaskit/media-core';
import { ItemViewer, ItemViewerBase } from '../../src/newgen/item-viewer';
import { ErrorMessage } from '../../src/newgen/error';
import { ImageViewer } from '../../src/newgen/viewers/image';
import { VideoViewer } from '../../src/newgen/viewers/video';
import { AudioViewer } from '../../src/newgen/viewers/audio';
import { DocViewer } from '../../src/newgen/viewers/doc';
import { Identifier } from '../../src/newgen/domain';

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
  collectionName: 'some-collection',
};

const makeFakeContext = (observable: Observable<any>) =>
  ({
    file: {
      getFileState: jest.fn(() => observable),
    },
  } as any);

function mountComponent(context: Context, identifier: Identifier) {
  const el = mount(
    <ItemViewer previewCount={0} context={context} identifier={identifier} />,
  );
  const itemViewerBase = el.find(ItemViewerBase);
  const instance = el.find(ItemViewerBase).instance() as any;
  return { el, itemViewerBase, instance };
}

function mountBaseComponent(context: Context, identifier: Identifier) {
  const createAnalyticsEventSpy = jest.fn();
  createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });
  const el = mount(
    <ItemViewerBase
      createAnalyticsEvent={createAnalyticsEventSpy}
      previewCount={0}
      context={context}
      identifier={identifier}
    />,
  );
  const instance = el.instance() as any;
  return { el, instance, createAnalyticsEventSpy };
}

describe('<ItemViewer />', () => {
  it('shows an indicator while loading', () => {
    const context = makeFakeContext(Observable.empty());
    const { el } = mountComponent(context, identifier);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a generic error on unkown error', () => {
    const context = makeFakeContext(
      Observable.throw('something bad happened!'),
    );
    const { el } = mountComponent(context, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain('Something went wrong');
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('should show the image viewer if media type is image', () => {
    const context = makeFakeContext(
      Observable.of({
        id: identifier.id,
        mediaType: 'image',
        status: 'processed',
      }),
    );
    const { el } = mountComponent(context, identifier);
    el.update();
    expect(el.find(ImageViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(ImageViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if processing Status failed', () => {
    const context = makeFakeContext(Observable.of({ status: 'error' }));
    const { el } = mountComponent(context, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We couldn't generate a preview for this file.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should show the video viewer if media type is video', () => {
    const context = makeFakeContext(
      Observable.of({
        id: identifier.id,
        mediaType: 'video',
        status: 'processed',
      }),
    );
    const { el } = mountComponent(context, identifier);
    el.update();
    expect(el.find(VideoViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(VideoViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the audio viewer if media type is audio', () => {
    const context = makeFakeContext(
      Observable.of({
        id: identifier.id,
        mediaType: 'audio',
        status: 'processed',
      }),
    );
    const { el } = mountComponent(context, identifier);
    el.update();
    expect(el.find(AudioViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(AudioViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the document viewer if media type is document', () => {
    const context = makeFakeContext(
      Observable.of({
        id: identifier.id,
        mediaType: 'doc',
        status: 'processed',
      }),
    );
    const { el } = mountComponent(context, identifier);
    el.update();
    expect(el.find(DocViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(DocViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if file is unsupported', () => {
    const context = makeFakeContext(
      Observable.of({
        id: identifier.id,
        mediaType: 'unknown',
        status: 'processed',
      }),
    );
    const { el } = mountComponent(context, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We can't preview this file type.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('MSW-720: passes the collectionName to getFileState', () => {
    const context = makeFakeContext(
      Observable.of({
        id: identifier.id,
        mediaType: 'image',
        status: 'processed',
      }),
    );
    const { el } = mountComponent(context, identifier);
    el.update();
    expect(context.file.getFileState).toHaveBeenCalledWith('some-id', {
      collectionName: 'some-collection',
    });
  });

  describe('Subscription', () => {
    it('unsubscribes from the provider when unmounted', () => {
      const release = jest.fn();
      const context = makeFakeContext(
        Observable.of({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
        }),
      );
      const { el, instance } = mountComponent(context, identifier);
      instance.release = release;
      expect(instance.release).toHaveBeenCalledTimes(0);
      el.unmount();
      expect(instance.release).toHaveBeenCalledTimes(1);
    });

    it('resubscribes to the provider when the data property value is changed', () => {
      const identifierCopy = { ...identifier };
      const context = makeFakeContext(
        Observable.of({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
        }),
      );
      const { el } = mountComponent(context, identifier);
      expect(context.file.getFileState).toHaveBeenCalledTimes(1);

      // if the values stay the same, we will not resubscribe
      el.setProps({ context, identifier: identifierCopy });
      expect(context.file.getFileState).toHaveBeenCalledTimes(1);

      // ... but if the identifier change we will resubscribe
      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };
      el.setProps({ context, identifier: identifier2 });
      expect(context.file.getFileState).toHaveBeenCalledTimes(2);

      // if the context changes, we will also resubscribe
      const newContext = makeFakeContext(
        Observable.of({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
        }),
      );

      el.setProps({ context: newContext, identifier: identifier2 });
      expect(context.file.getFileState).toHaveBeenCalledTimes(2);
      expect(newContext.file.getFileState).toHaveBeenCalledTimes(1);
    });

    it('should return to PENDING state when resets', () => {
      const context = makeFakeContext(
        Observable.of({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
        }),
      );
      const { el, instance } = mountBaseComponent(context, identifier);
      expect(instance.state.item.status).toEqual('SUCCESSFUL');

      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };

      // since the test is executed synchronously
      // let's prevent the second call to getFile from immediately resolving and
      // updating the state to SUCCESSFUL before we run the assertion.
      context.file.getFileState = () => Observable.never();
      el.setProps({ context, identifier: identifier2 });
      el.update();

      expect(el.instance().state.item.status).toEqual('PENDING');
    });
  });

  describe('Analytics', () => {
    it('should trigger analytics when the preview commences', () => {
      const context = makeFakeContext(
        Observable.of({
          id: identifier.id,
          mediaType: 'unknown',
          status: 'processed',
        }),
      );
      const { createAnalyticsEventSpy } = mountBaseComponent(
        context,
        identifier,
      );
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'commenced',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: { fileId: 'some-id' },
        eventType: 'operational',
      });
    });

    it('should trigger analytics when metadata fetching ended with an error', () => {
      const context = makeFakeContext(
        Observable.throw('something bad happened!'),
      );
      const { createAnalyticsEventSpy } = mountBaseComponent(
        context,
        identifier,
      );
      expect(createAnalyticsEventSpy).toHaveBeenCalledTimes(2);
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'commenced',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: { fileId: 'some-id' },
        eventType: 'operational',
      });
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'loaded',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          failReason: 'Metadata fetching failed',
          fileId: 'some-id',
          status: 'fail',
        },
        eventType: 'operational',
      });
    });

    it('should trigger analytics when viewer returned an error', () => {
      const context = makeFakeContext(
        Observable.of({
          id: identifier.id,
          mediaType: 'image',
          status: 'processed',
        }),
      );
      const { createAnalyticsEventSpy } = mountBaseComponent(
        context,
        identifier,
      );
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'loaded',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          failReason: 'Viewer error',
          fileId: 'some-id',
          fileMediatype: 'image',
          fileSize: undefined,
          status: 'fail',
        },
        eventType: 'operational',
      });
    });

    it('should trigger analytics when viewer is successful', () => {
      // TODO.
      // should we mock the ImageViewer component or its internals (getBlobService)?
    });
  });
});
