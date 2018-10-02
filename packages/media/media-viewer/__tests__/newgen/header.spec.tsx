declare var window: any;
import * as util from '../../src/newgen/utils';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { createContext } from '../_stubs';
import { Subject } from 'rxjs';
import { MediaItem, MediaItemType, MediaType } from '@atlaskit/media-core';
import Header from '../../src/newgen/header';
import { FeedbackButton } from '../../src/newgen/feedback-button';
import { MetadataFileName, MetadataSubText } from '../../src/newgen/styled';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { LeftHeader } from '../../src/newgen/styled';

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
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('shows an empty header while loading', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <Header context={createContext({ subject })} identifier={identifier} />,
    );
    const metadata = el.find(LeftHeader);
    expect(metadata.text()).toEqual('');
  });

  it('resubscribes to the provider when the data property value is changed', () => {
    const subject = new Subject<MediaItem>();
    const context = createContext({ subject });
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
    const context = createContext({ subject });
    const el = mount(<Header context={context} identifier={identifier} />);
    subject.next(imageItem);
    expect(el.state().item.status).toEqual('SUCCESSFUL');
    el.setProps({ identifier: identifier2 });
    expect(el.state().item.status).toEqual('PENDING');
  });

  describe('Metadata', () => {
    describe('File collectionName', () => {
      it('shows the title when loaded', () => {
        const subject = new Subject<MediaItem>();
        const el = mount(
          <Header
            context={createContext({ subject })}
            identifier={identifier}
          />,
        );
        subject.next(imageItem);
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('my image');
      });

      it('shows unknown if file collectionName not provided on metadata', () => {
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
          <Header
            context={createContext({ subject })}
            identifier={identifier}
          />,
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
          <Header
            context={createContext({ subject })}
            identifier={identifier}
          />,
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
          <Header
            context={createContext({ subject })}
            identifier={identifier}
          />,
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
          <Header
            context={createContext({ subject })}
            identifier={identifier}
          />,
        );
        subject.next(noSizeItem);
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual('unknown · 22.2 MB');
      });
    });

    it('shows nothing when metadata failed to be retrieved', () => {
      const subject = new Subject<MediaItem>();
      const el = mount(
        <Header context={createContext({ subject })} identifier={identifier} />,
      );
      subject.error(new Error('error'));
      const metadata = el.find(LeftHeader);
      expect(metadata.text()).toEqual('');
    });

    it('should not display metadata for links (not supported at this point)', () => {
      const subject = new Subject<MediaItem>();
      const context = createContext({ subject });
      const el = mount(
        <Header context={context} identifier={linkIdentifier} />,
      );
      subject.next(linkItem);
      const metadata = el.find(LeftHeader);
      expect(metadata.text()).toEqual('');
    });
  });

  it('MSW-720: passes the collectionName to the provider', () => {
    const collectionName = 'some-collection';
    const subject = new Subject<MediaItem>();
    const context = createContext({ subject });
    const identifierWithCollection = { ...identifier, collectionName };
    const el = mount(
      <Header context={context} identifier={identifierWithCollection} />,
    );
    subject.next(imageItem);
    el.update();
    expect((context.getMediaItemProvider as any).mock.calls[0][2]).toEqual(
      collectionName,
    );
  });

  it('MSW-720: passes the collectionName to context.file.downloadBinary', () => {
    const collectionName = 'some-collection';
    const subject = new Subject<MediaItem>();
    const context = createContext({ subject });
    const identifierWithCollection = { ...identifier, collectionName };
    const el = mount(
      <Header context={context} identifier={identifierWithCollection} />,
    );
    subject.next(imageItem);
    el.update();
    el.find(DownloadIcon).simulate('click');
    expect(context.file.downloadBinary.mock.calls[0][2]).toEqual(
      collectionName,
    );
  });

  describe('Feedback button', () => {
    let jquery: any;

    beforeEach(() => {
      jquery = window.jQuery;
    });

    afterEach(() => {
      window.jQuery = jquery;
    });

    it('should not show the feedback button if jQuery is not found in window object', () => {
      const subject = new Subject<MediaItem>();
      const context = createContext({ subject });
      const el = mount(<Header context={context} identifier={identifier} />);
      expect(el.find(FeedbackButton).html()).toBeNull();
    });

    it('should show the feedback button if jQuery is found in window object', () => {
      const subject = new Subject<MediaItem>();
      const context = createContext({ subject });
      window.jQuery = {};
      const el = mount(<Header context={context} identifier={identifier} />);
      expect(el.find(FeedbackButton).html()).not.toBeNull();
    });
  });

  describe('Download button', () => {
    const assertDownloadButton = (
      el: ReactWrapper<any, any>,
      enabled: boolean,
    ) => {
      expect(
        el.find({ type: 'button', label: 'Download', isDisabled: !enabled }),
      ).toHaveLength(1);
      expect(el.find(DownloadIcon)).toHaveLength(1);
    };

    it('should show the download button disabled while the item metadata is loading', () => {
      const subject = new Subject<MediaItem>();
      const el = mount(
        <Header context={createContext({ subject })} identifier={identifier} />,
      );
      el.update();
      assertDownloadButton(el, false);
    });

    it('should show the download button enabled when the item is loaded', () => {
      const subject = new Subject<MediaItem>();
      const el = mount(
        <Header context={createContext({ subject })} identifier={identifier} />,
      );
      subject.next(imageItem);
      el.update();
      assertDownloadButton(el, true);
    });

    it('should show the download button disabled when there is an error', () => {
      const subject = new Subject<MediaItem>();
      const el = mount(
        <Header context={createContext({ subject })} identifier={identifier} />,
      );
      subject.error(new Error('error'));
      el.update();
      assertDownloadButton(el, false);
    });
  });
});
