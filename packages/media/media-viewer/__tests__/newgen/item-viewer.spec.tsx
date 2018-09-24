import * as React from 'react';
import { Observable } from 'rxjs';
import { mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import { MediaItemType } from '@atlaskit/media-core';
import { ItemViewer } from '../../src/newgen/item-viewer';
import { ErrorMessage } from '../../src/newgen/error';
import { ImageViewer } from '../../src/newgen/viewers/image';
import { VideoViewer } from '../../src/newgen/viewers/video';
import { AudioViewer } from '../../src/newgen/viewers/audio';
import { DocViewer } from '../../src/newgen/viewers/doc';

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
  collectionName: 'some-collection',
};

describe('<ItemViewer />', () => {
  it('shows an indicator while loading', () => {
    const context = {
      getFile: () => Observable.empty(),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a generic error on unkown error', () => {
    const context = {
      getFile: () => Observable.throw('something bad happened!'),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain('Something went wrong');
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('should show the image viewer if media type is image', () => {
    const context = {
      getFile: () =>
        Observable.of({
          id: '123',
          mediaType: 'image',
          status: 'processed',
        }),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    el.update();
    expect(el.find(ImageViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(ImageViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if processing Status failed', () => {
    const context = {
      getFile: () => Observable.of({ status: 'error' }),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We couldn't generate a preview for this file.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should show the video viewer if media type is video', () => {
    const context = {
      getFile: () =>
        Observable.of({
          id: '123',
          mediaType: 'video',
          status: 'processed',
        }),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    el.update();
    expect(el.find(VideoViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(VideoViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the audio viewer if media type is audio', () => {
    const context = {
      getFile: () =>
        Observable.of({
          id: '123',
          mediaType: 'audio',
          status: 'processed',
        }),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    el.update();
    expect(el.find(AudioViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(AudioViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the document viewer if media type is document', () => {
    const context = {
      getFile: () =>
        Observable.of({
          id: '123',
          mediaType: 'doc',
          status: 'processed',
        }),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    el.update();
    expect(el.find(DocViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(DocViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if file is unsupported', () => {
    const context = {
      getFile: () =>
        Observable.of({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
        }),
    } as any;
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We can't preview this file type.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  describe('Subscription', () => {
    it('unsubscribes from the provider when unmounted', () => {
      const release = jest.fn();
      const context = {
        getFile: () =>
          Observable.of({
            id: '123',
            mediaType: 'unknown',
            status: 'processed',
          }),
      } as any;

      const el = mount(
        <ItemViewer
          previewCount={0}
          context={context}
          identifier={identifier}
        />,
      );
      const instance = el.instance() as ItemViewer;
      instance.release = release;
      expect(instance.release).toHaveBeenCalledTimes(0);
      el.unmount();
      expect(instance.release).toHaveBeenCalledTimes(1);
    });

    it('resubscribes to the provider when the data property value is changed', () => {
      const identifierCopy = { ...identifier };
      const context = {
        getFile: jest.fn(() =>
          Observable.of({
            id: '123',
            mediaType: 'unknown',
            status: 'processed',
          }),
        ),
      } as any;
      const el = mount(
        <ItemViewer
          previewCount={0}
          context={context}
          identifier={identifier}
        />,
      );

      expect(context.getFile).toHaveBeenCalledTimes(1);

      // if the values stay the same, we will not resubscribe
      el.setProps({ context, identifier: identifierCopy });
      expect(context.getFile).toHaveBeenCalledTimes(1);

      // ... but if the identifier change we will resubscribe
      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };
      el.setProps({ context, identifier: identifier2 });
      expect(context.getFile).toHaveBeenCalledTimes(2);

      // if the context changes, we will also resubscribe
      const newContext = {
        getFile: jest.fn(() =>
          Observable.of({
            id: '123',
            mediaType: 'unknown',
            status: 'processed',
          }),
        ),
      } as any;

      el.setProps({ context: newContext, identifier: identifier2 });
      expect(context.getFile).toHaveBeenCalledTimes(2);
      expect(newContext.getFile).toHaveBeenCalledTimes(1);
    });

    it('should return to PENDING state when resets', () => {
      const context = {
        getFile: () =>
          Observable.of({
            id: '123',
            mediaType: 'unknown',
            status: 'processed',
          }),
      } as any;
      const el = mount(
        <ItemViewer
          previewCount={0}
          context={context}
          identifier={identifier}
        />,
      );

      expect(el.state().item.status).toEqual('SUCCESSFUL');

      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };

      // since the test is executed synchronusly
      // let's prevent the second call to getFile form immediately resolving and
      // udpateing the state to SUCCESSFUL before we run the assertion.
      context.getFile = () => Observable.never();

      el.setProps({ context, identifier: identifier2 });
      el.update();

      expect(el.state().item.status).toEqual('PENDING');
    });
  });
});
