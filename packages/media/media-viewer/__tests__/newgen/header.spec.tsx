import * as React from 'react';
import { mount } from 'enzyme';
import { Stubs } from '../_stubs';
import { Subject } from 'rxjs';
import { MediaItem, MediaItemType, MediaType } from '@atlaskit/media-core';
import Header from '../../src/newgen/header';
import { MetadataFileName, MetadataSubText } from '../../src/newgen/styled';

function createContext(subject: Subject<MediaItem>) {
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
    Stubs.mediaItemProvider(subject),
  ) as any;
}

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

const identifier2 = {
  id: 'some-id-2',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

const linkIdentifier = {
  id: 'some-id-2',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'link' as MediaItemType,
};

const imageItem: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'image',
    name: 'my image',
    size: 12222222,
  },
};

const linkItem: MediaItem = {
  type: 'link',
  details: {
    id: 'some-link-id',
    type: 'link',
    url: 'http://domain.com',
    title: 'a link',
  },
};

describe('<Header />', () => {
  it('shows an empty header while loading', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <Header context={createContext(subject)} identifier={identifier} />,
    );
    expect(el.text()).toEqual('');
  });

  it('resubscribes to the provider when the data property value is changed', () => {
    const subject = new Subject<MediaItem>();
    const context = createContext(subject);
    const el = mount(<Header context={context} identifier={identifier} />);
    subject.next(imageItem);
    el.update();
    expect(el.find(MetadataFileName).text()).toEqual('my image');

    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(1);
    el.setProps({ identifier: identifier2 });
    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(2);
  });

  it('component resets initial state when new props are passed', () => {
    const subject = new Subject<MediaItem>();
    const context = createContext(subject);
    const el = mount(<Header context={context} identifier={identifier} />);
    subject.next(imageItem);
    expect(el.state()).toMatchObject({ item: { status: 'SUCCESSFUL' } });
    el.setProps({ identifier: identifier2 });
    expect(el.state()).toMatchObject({ item: { status: 'PENDING' } });
  });

  describe('Metadata', () => {
    describe('File name', () => {
      it('shows the title when loaded', () => {
        const subject = new Subject<MediaItem>();
        const el = mount(
          <Header context={createContext(subject)} identifier={identifier} />,
        );
        subject.next(imageItem);
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('my image');
      });

      it('shows unknown if file name not provided on metadata', () => {
        const noNameItem: MediaItem = {
          type: 'file',
          details: {
            id: 'some-id',
            processingStatus: 'succeeded',
            mediaType: 'image',
            size: 12443455,
          },
        };
        const subject = new Subject<MediaItem>();
        const el = mount(
          <Header context={createContext(subject)} identifier={identifier} />,
        );
        subject.next(noNameItem);
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('unknown');
      });
    });

    describe('File metadata', () => {
      const testMediaTypeText = (
        mediaType: MediaType,
        expectedText: string,
      ) => {
        const item: MediaItem = {
          type: 'file',
          details: {
            id: 'some-id',
            processingStatus: 'succeeded',
            mediaType: mediaType,
            name: 'my item',
            size: 12222222,
          },
        };

        const subject = new Subject<MediaItem>();
        const el = mount(
          <Header context={createContext(subject)} identifier={identifier} />,
        );
        subject.next(item);
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual(
          `${expectedText} · 11.7 MB`,
        );
      };

      it('should render media type text and file size for each media type', () => {
        testMediaTypeText('image', 'image');
        testMediaTypeText('audio', 'audio');
        testMediaTypeText('video', 'video');
        testMediaTypeText('unknown', 'unknown');
        testMediaTypeText('doc', 'document');
      });

      it('should no render file size if not available', () => {
        const noSizeItem: MediaItem = {
          type: 'file',
          details: {
            id: 'some-id',
            processingStatus: 'succeeded',
            mediaType: 'image',
            name: 'no-size',
          },
        };
        const subject = new Subject<MediaItem>();
        const el = mount(
          <Header context={createContext(subject)} identifier={identifier} />,
        );
        subject.next(noSizeItem);
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual('image');
      });

      it('should no render media type if not available', () => {
        const noSizeItem: MediaItem = {
          type: 'file',
          details: {
            id: 'some-id',
            processingStatus: 'succeeded',
            name: 'no-size',
            size: 23232323,
          },
        };
        const subject = new Subject<MediaItem>();
        const el = mount(
          <Header context={createContext(subject)} identifier={identifier} />,
        );
        subject.next(noSizeItem);
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual('unknown · 22.2 MB');
      });
    });

    it('shows nothing with metadata failed to be retrieved', () => {
      const subject = new Subject<MediaItem>();
      const el = mount(
        <Header context={createContext(subject)} identifier={identifier} />,
      );
      subject.error(new Error('error'));
      expect(el.text()).toEqual('');
    });

    it('should not display metadata for links (not supported at this point)', () => {
      const subject = new Subject<MediaItem>();
      const context = createContext(subject);
      const el = mount(
        <Header context={context} identifier={linkIdentifier} />,
      );
      subject.next(linkItem);
      expect(el.text()).toEqual('');
    });
  });
});
