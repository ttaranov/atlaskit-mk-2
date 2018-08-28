import * as React from 'react';
import { shallow } from 'enzyme';
import { EmojiProvider } from '@atlaskit/emoji';
import EditorEmojiTypeAhead from '../../../../../plugins/emoji/ui/EmojiTypeAhead';
import { analyticsService } from '../../../../../analytics';

describe('EmojiTypeAhead', () => {
  const emojiProvider = Promise.resolve({} as EmojiProvider);

  const validateAnalytics = (currentData, expectedData) => {
    expect(currentData.event).toBe(expectedData.event);

    // does not validate duration cos it is time based
    expect(currentData.data.mode).toBe(expectedData.data.mode);
    expect(currentData.data.emojiId).toBe(expectedData.data.emojiId);
    expect(currentData.data.type).toBe(expectedData.data.type);
    expect(currentData.data.queryLength).toBe(expectedData.data.queryLength);
  };

  describe('Analytics', () => {
    const insertEmojiMock = jest.fn();
    const selectNextMock = jest.fn();
    const selectPreviousMock = jest.fn();

    const pluginKey = {
      getState: jest.fn(),
    } as any;

    const editorView = {
      insertEmoji: jest.fn(),
    } as any;

    const emojiTypeAheadMock = {
      selectNext: selectNextMock,
      selectPrevious: selectPreviousMock,
    } as any;

    let trackEvent;
    let component;
    let componentInstance;

    pluginKey.getState.mockReturnValue({
      query: ':ok',
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      insertEmoji: insertEmojiMock,
    });

    beforeEach(() => {
      trackEvent = jest.spyOn(analyticsService, 'trackEvent');

      component = shallow(
        <EditorEmojiTypeAhead
          pluginKey={pluginKey}
          editorView={editorView}
          emojiProvider={emojiProvider}
        />,
      );
      componentInstance = component.instance() as EditorEmojiTypeAhead;

      componentInstance.handleEmojiTypeAheadRef(emojiTypeAheadMock);
    });

    afterEach(() => {
      trackEvent.mockRestore();
      component.unmount();
    });

    it('should fire analytics in handleOnOpen', () => {
      componentInstance.handleOnOpen();
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.open',
        {},
      );
    });

    it('should fire analytics in handleOnClose', () => {
      componentInstance.handleOnClose();
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.close',
        {},
      );
    });

    it('should fire analytics in handleSpaceTyped', () => {
      componentInstance.handleSpaceTyped();
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.space',
        {},
      );
    });

    it('should fire analytics in handleSelectPrevious', () => {
      componentInstance.handleSelectPrevious();
      expect(selectPreviousMock).toHaveBeenCalled();
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.keyup',
        {},
      );
    });

    it('should fire analytics in handleSelectNext', () => {
      componentInstance.handleSelectNext();
      expect(selectNextMock).toHaveBeenCalled();
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.keydown',
        {},
      );
    });

    it('should fire analytics in handleSpaceSelectCurrent', () => {
      componentInstance.handleOnOpen(); // set openTime

      componentInstance.handleSpaceSelectCurrent(
        {
          id: 'emojiId',
          type: 'emojiType',
        },
        'Enter',
        ':foo',
      );

      expect(trackEvent).toHaveBeenCalled();

      // first call fired in handleOnOpen(), not interested here. Second call fired in handleSpaceSelectCurrent()
      const secondCallArgs = trackEvent.mock.calls[1];
      validateAnalytics(
        {
          event: secondCallArgs[0],
          data: secondCallArgs[1],
        },
        {
          event: 'atlassian.fabric.emoji.typeahead.select',
          data: {
            mode: 'enter',
            emojiId: 'emojiId',
            type: 'emojiType',
            queryLength: 4,
          },
        },
      );
    });

    it('should fire analytics in handleSelectedEmoji', () => {
      componentInstance.handleOnOpen(); // set openTime

      componentInstance.handleSelectedEmoji('emojiId', {
        id: 'emojiId',
        type: 'emojiType',
      });

      expect(insertEmojiMock).toHaveBeenCalledWith('emojiId');
      expect(trackEvent).toHaveBeenCalled();

      // first call fired in handleOnOpen(), not interested here. Second call fired in handleSpaceSelectCurrent()
      const secondCallArgs = trackEvent.mock.calls[1];
      validateAnalytics(
        {
          event: secondCallArgs[0],
          data: secondCallArgs[1],
        },
        {
          event: 'atlassian.fabric.emoji.typeahead.select',
          data: {
            mode: 'selected',
            emojiId: 'emojiId',
            type: 'emojiType',
            queryLength: 3,
          },
        },
      );
    });
  });
});
