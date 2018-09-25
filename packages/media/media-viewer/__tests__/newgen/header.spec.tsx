declare var window: any;
import * as util from '../../src/newgen/utils';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { Observable } from 'rxjs';
import { mount, ReactWrapper } from 'enzyme';
import { MediaItemType, MediaType } from '@atlaskit/media-core';
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

describe('<Header />', () => {
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('shows an empty header while loading', () => {
    const context = {
      getFile: () => Observable.empty(),
    } as any;
    const el = mount(<Header context={context} identifier={identifier} />);
    const metadata = el.find(LeftHeader);
    expect(metadata.text()).toEqual('');
  });

  it('resubscribes to the provider when the data property value is changed', () => {
    const context = {
      getFile: jest.fn(() =>
        Observable.of({
          id: '123',
          mediaType: 'image',
          status: 'processed',
          name: 'my image',
        }),
      ),
    } as any;
    const el = mount(<Header context={context} identifier={identifier} />);
    el.update();
    expect(el.find(MetadataFileName).text()).toEqual('my image');

    expect(context.getFile).toHaveBeenCalledTimes(1);
    el.setProps({ identifier: identifier2 });
    expect(context.getFile).toHaveBeenCalledTimes(2);
  });

  it('component resets initial state when new props are passed', () => {
    const context = {
      getFile: () =>
        Observable.of({
          id: '123',
          mediaType: 'image',
          status: 'processed',
          name: 'my image',
        }),
    } as any;
    const el = mount(<Header context={context} identifier={identifier} />);
    expect(el.state().item.status).toEqual('SUCCESSFUL');

    // since the test is executed synchronously
    // let's prevent the second call to getFile form immediately resolving and
    // updating the state to SUCCESSFUL before we run the assertion.
    context.getFile = () => Observable.never();

    el.setProps({ identifier: identifier2 });
    expect(el.state().item.status).toEqual('PENDING');
  });

  describe('Metadata', () => {
    describe('File collectionName', () => {
      it('shows the title when loaded', () => {
        const context = {
          getFile: () =>
            Observable.of({
              id: '123',
              mediaType: 'image',
              status: 'processed',
              name: 'my image',
            }),
        } as any;
        const el = mount(<Header context={context} identifier={identifier} />);
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('my image');
      });

      it('shows unknown if file collectionName not provided on metadata', () => {
        const context = {
          getFile: () =>
            Observable.of({
              id: '123',
              mediaType: 'image',
              status: 'processed',
            }),
        } as any;
        const el = mount(<Header context={context} identifier={identifier} />);
        el.update();
        expect(el.find(MetadataFileName).text()).toEqual('unknown');
      });
    });

    describe('File metadata', () => {
      const testMediaTypeText = (
        mediaType: MediaType,
        expectedText: string,
      ) => {
        const context = {
          getFile: () =>
            Observable.of({
              id: '123',
              mediaType,
              status: 'processed',
              size: 12222222,
            }),
        } as any;
        const el = mount(<Header context={context} identifier={identifier} />);
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
        const context = {
          getFile: () =>
            Observable.of({
              id: '123',
              mediaType: 'image',
              status: 'processed',
            }),
        } as any;
        const el = mount(<Header context={context} identifier={identifier} />);
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual('image');
      });

      it('should no render media type if not available', () => {
        const context = {
          getFile: () =>
            Observable.of({
              id: '123',
              status: 'processed',
              size: 23232323,
            }),
        } as any;
        const el = mount(<Header context={context} identifier={identifier} />);
        el.update();
        expect(el.find(MetadataSubText).text()).toEqual('unknown · 22.2 MB');
      });
    });

    it('shows nothing when metadata failed to be retrieved', () => {
      const context = {
        getFile: () => Observable.throw('something bad happened!'),
      } as any;
      const el = mount(<Header context={context} identifier={identifier} />);
      const metadata = el.find(LeftHeader);
      expect(metadata.text()).toEqual('');
    });
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
      const context = {
        getFile: () =>
          Observable.of({
            id: '123',
            status: 'processed',
            size: 23232323,
          }),
      } as any;
      const el = mount(<Header context={context} identifier={identifier} />);
      expect(el.find(FeedbackButton).html()).toBeNull();
    });

    it('should show the feedback button if jQuery is found in window object', () => {
      const context = {
        getFile: () =>
          Observable.of({
            id: '123',
            status: 'processed',
            size: 23232323,
          }),
      } as any;
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
      const context = {
        getFile: () => Observable.empty(),
      } as any;
      const el = mount(<Header context={context} identifier={identifier} />);
      el.update();
      assertDownloadButton(el, false);
    });

    it('should show the download button enabled when the item is loaded', () => {
      const context = {
        getFile: () =>
          Observable.of({
            id: '123',
            status: 'processed',
            size: 23232323,
          }),
      } as any;
      const el = mount(<Header context={context} identifier={identifier} />);
      el.update();
      assertDownloadButton(el, true);
    });

    it('should show the download button disabled when there is an error', () => {
      const context = {
        getFile: () => Observable.throw('some error'),
      } as any;
      const el = mount(<Header context={context} identifier={identifier} />);
      el.update();
      assertDownloadButton(el, false);
    });

    it('should use a fresh token for the download link', () => {
      const context = {
        getFile: () =>
          Observable.of({
            id: '123',
            status: 'processed',
            size: 23232323,
          }),
        config: {
          authProvider: jest.fn(),
        },
      } as any;
      const el = mount(<Header context={context} identifier={identifier} />);
      el.update();
      el.find(DownloadIcon).simulate('click');
      expect(context.config.authProvider).toHaveBeenCalled();
    });
  });
});
