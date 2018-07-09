import * as React from 'react';
import { shallow } from 'enzyme';
import { MentionResource, MentionDescription } from '@atlaskit/mention';
import { EditorView } from 'prosemirror-view';
import { MentionPicker } from '../../../../src/plugins/mentions/ui/MentionPicker';
import { analyticsService } from '../../../../src/analytics';
import { enter } from '../../../../src/keymaps';

describe('MentionPicker', () => {
  describe('Analytics', () => {
    let trackEvent;
    let component;
    let componentInstance: MentionPicker;

    const mentionProvider = Promise.resolve(
      new MentionResource({
        url: `https://url/mentions/abcde`,
        containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
        productId: 'chat',
      }),
    );
    const contextIdentifierProvider = Promise.resolve({
      containerId: 'container-id',
      objectId: 'object-id',
    });

    const pluginKey = {
      getState: jest.fn(),
    } as any;

    const editorView: EditorView = {
      state: {},
    } as EditorView;

    const createAnalyticsEvent = jest.fn();
    let state;

    beforeEach(() => {
      createAnalyticsEvent.mockReturnValue({ fire: jest.fn() });
      trackEvent = jest.spyOn(analyticsService, 'trackEvent');
      state = {
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
        dismiss: jest.fn(),
        insertMention: jest.fn(),
      };

      pluginKey.getState.mockReturnValueOnce(state);

      component = shallow(
        <MentionPicker
          mentionProvider={mentionProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          pluginKey={pluginKey}
          editorView={editorView}
          createAnalyticsEvent={createAnalyticsEvent}
        />,
      );
      componentInstance = component.instance() as MentionPicker;
      (componentInstance as any).picker = {
        selectNext: jest.fn(),
        selectPrevious: jest.fn(),
        chooseCurrentSelection: jest.fn(),
      };
    });

    afterEach(() => {
      trackEvent.mockRestore();
      component.unmount();
      createAnalyticsEvent.mockReset();
    });

    it('should fire analytics in handleSpaceTyped', () => {
      componentInstance.handleSpaceTyped();
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.mention.picker.space',
        {},
      );
    });

    it('should fire analytics in fireMentionInsert', () => {
      (componentInstance as any).fireMentionInsertAnalytics({
        id: 'AID-SECRET-@@@',
        accessLevel: 'HIGH',
      });
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.mention.picker.insert',
        {
          containerId: 'container-id',
          objectId: 'object-id',

          mode: 'selected',
          duration: 0,
          accessLevel: 'HIGH',
          isSpecial: false,
          queryLength: 0,

          mentionee: 'AID-SECRET-@@@',
        },
      );
    });

    describe('mentionTypeahead', () => {
      const mention: MentionDescription = {
        id: 'abc-123',
        accessLevel: 'CONTAINER',
        userType: 'DEFAULT',
      };
      const mentions: MentionDescription[] = [
        { id: '123-abc' },
        mention,
        { id: '321-abc' },
      ];

      it('should fire typeahead cancelled event', () => {
        const event: any = { fire: jest.fn() };
        createAnalyticsEvent.mockReturnValueOnce(event);
        state.lastQuery = 'someQuery';
        state.onSelectNext();
        state.onSelectNext();
        state.onSelectPrevious();
        state.onDismiss();
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'cancelled',
            actionSubject: 'typeahead',
            actionSubjectId: 'mentionTypeahead',
            eventType: 'ui',
            source: 'unknown',
            attributes: expect.objectContaining({
              packageName: '@atlaskit/editor-core',
              packageVersion: expect.any(String),
              spaceInQuery: false,
              queryLength: 9,
              duration: expect.any(Number),
              upKeyCount: 1,
              downKeyCount: 2,
            }),
          }),
        );
        expect(event.fire).toHaveBeenCalledTimes(1);
        expect(event.fire).toHaveBeenCalledWith('fabric-elements');
      });

      it('should fire typeahead pressed event', () => {
        const event: any = { fire: jest.fn() };
        createAnalyticsEvent.mockReturnValueOnce(event);
        state.lastQuery = 'someQuery';
        state.onSelectNext();
        state.onSelectNext();
        state.onSelectPrevious();
        component.setState({ mentions });
        state.onSelectCurrent(enter.common);
        (componentInstance as any).handleSelectedMention(mention);
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'pressed',
            actionSubject: 'typeahead',
            actionSubjectId: 'mentionTypeahead',
            eventType: 'ui',
            source: 'unknown',
            attributes: expect.objectContaining({
              packageName: '@atlaskit/editor-core',
              packageVersion: expect.any(String),
              duration: expect.any(Number),
              position: 1,
              keyboardKey: 'enter',
              queryLength: 9,
              spaceInQuery: false,
              accessLevel: 'CONTAINER',
              userType: 'DEFAULT',
              userId: 'abc-123',
              upKeyCount: 1,
              downKeyCount: 2,
            }),
          }),
        );
        expect(event.fire).toHaveBeenCalledTimes(1);
        expect(event.fire).toHaveBeenCalledWith('fabric-elements');
      });

      it('should fire typeahead clicked event', () => {
        const event: any = { fire: jest.fn() };
        createAnalyticsEvent.mockReturnValueOnce(event);
        state.lastQuery = 'longer Query';
        state.onSelectNext();
        state.onSelectPrevious();
        state.onSelectPrevious();
        state.onSelectPrevious();
        component.setState({ mentions });
        (componentInstance as any).handleSelectedMention(mention);
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'clicked',
            actionSubject: 'typeahead',
            actionSubjectId: 'mentionTypeahead',
            eventType: 'ui',
            source: 'unknown',
            attributes: expect.objectContaining({
              packageName: '@atlaskit/editor-core',
              packageVersion: expect.any(String),
              duration: expect.any(Number),
              position: 1,
              keyboardKey: undefined,
              queryLength: 12,
              spaceInQuery: true,
              accessLevel: 'CONTAINER',
              userType: 'DEFAULT',
              userId: 'abc-123',
              upKeyCount: 3,
              downKeyCount: 1,
            }),
          }),
        );
        expect(event.fire).toHaveBeenCalledTimes(1);
        expect(event.fire).toHaveBeenCalledWith('fabric-elements');
      });
    });
  });
});
