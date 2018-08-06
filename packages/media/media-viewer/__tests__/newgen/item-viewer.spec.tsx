import * as React from 'react';
import { mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import { ItemViewer } from '../../src/newgen/item-viewer';
import { ErrorMessage } from '../../src/newgen/error';
import { ImageViewer } from '../../src/newgen/viewers/image';
import { VideoViewer } from '../../src/newgen/viewers/video';
import { AudioViewer } from '../../src/newgen/viewers/audio';
import { DocViewer } from '../../src/newgen/viewers/doc';
import { createContext } from '../_stubs';
import { Subject } from 'rxjs';

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
  collectionName: 'some-collection',
};

const imageItem: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'image',
  },
};

const videoItem: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'video',
  },
};

const audioItem: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'audio',
  },
};

const videoItemFailedProcessing: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'failed',
    mediaType: 'video',
  },
};

const docItem: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'doc',
  },
};

const unsupportedItem: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'unknown',
  },
};

const linkItem: MediaItem = {
  type: 'link',
  details: {
    id: 'some-id',
    type: '',
    url: '',
    title: '',
  },
};

describe('<ItemViewer />', () => {
  it('shows an indicator while loading', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a generic error on unknown failure', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.error(new Error('error'));
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain('Something went wrong');
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('should show the image viewer if media type is image', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.next(imageItem);
    el.update();
    expect(el.find(ImageViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(ImageViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if processing Status failed', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.next(videoItemFailedProcessing);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We couldn't generate a preview for this file.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should show the video viewer if media type is video', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.next(videoItem);
    el.update();
    expect(el.find(VideoViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(VideoViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the audio viewer if media type is video', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.next(audioItem);
    el.update();
    expect(el.find(AudioViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(AudioViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the document viewer if media type is document', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.next(docItem);
    el.update();
    expect(el.find(DocViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(DocViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if file is unsupported', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.next(unsupportedItem);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We can't preview this file type.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should show an error for a link (not supported)', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <ItemViewer
        previewCount={0}
        context={createContext({ subject })}
        identifier={identifier}
      />,
    );
    subject.next(linkItem);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain('Links are not supported.');

    // no download button
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('MSW-720: passes the collectionName to the provider', () => {
    const subject = new Subject<MediaItem>();
    const context = createContext({ subject });
    const el = mount(
      <ItemViewer previewCount={0} context={context} identifier={identifier} />,
    );
    subject.next(linkItem);
    el.update();

    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      identifier.id,
      identifier.type,
      identifier.collectionName,
    );
  });

  describe('Subscription', () => {
    it('unsubscribes from the provider when unmounted', () => {
      const subject = new Subject<MediaItem>();
      const el = mount(
        <ItemViewer
          previewCount={0}
          context={createContext({ subject })}
          identifier={identifier}
        />,
      );
      expect(subject.observers).toHaveLength(1);
      el.unmount();
      expect(subject.observers).toHaveLength(0);
    });

    it('resubscribes to the provider when the data property value is changed', () => {
      const identifierCopy = { ...identifier };
      const subject = new Subject<MediaItem>();
      const context = createContext({ subject });
      const el = mount(
        <ItemViewer
          previewCount={0}
          context={context}
          identifier={identifier}
        />,
      );

      expect(context.getMediaItemProvider).toHaveBeenCalledTimes(1);

      // if the values stay the same, we will not resubscribe
      el.setProps({ context, identifier: identifierCopy });
      expect(context.getMediaItemProvider).toHaveBeenCalledTimes(1);

      // ... but if the identifier change we will resubscribe
      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };
      el.setProps({ context, identifier: identifier2 });
      expect(context.getMediaItemProvider).toHaveBeenCalledTimes(2);

      // if the context changes, we will also resubscribe
      const newContext = createContext({ subject });
      el.setProps({ context: newContext, identifier: identifier2 });
      expect(context.getMediaItemProvider).toHaveBeenCalledTimes(2);
      expect(newContext.getMediaItemProvider).toHaveBeenCalledTimes(1);
    });

    it('should return to PENDING state when resets', () => {
      const subject = new Subject<MediaItem>();
      const context = createContext({ subject });
      const el = mount(
        <ItemViewer
          previewCount={0}
          context={context}
          identifier={identifier}
        />,
      );

      expect(el.state().item.status).toEqual('PENDING');
      subject.next(docItem);
      expect(el.state().item.status).toEqual('SUCCESSFUL');

      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };

      el.setProps({ context, identifier: identifier2 });
      expect(el.state().item.status).toEqual('PENDING');
    });
  });
});
