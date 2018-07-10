import { MentionDescription, MentionResource, ContextMentionResource } from '@atlaskit/mention';
import { shallow } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import { analyticsService } from '../../../../src/analytics';
import { enter } from '../../../../src/keymaps';
import { MentionPicker } from '../../../../src/plugins/mentions/ui/MentionPicker';

describe('MentionPicker', () => {
  describe('Analytics', () => {
    let trackEvent;
    let component;
    let componentInstance: MentionPicker;

    const mentionResource = new MentionResource({
      url: `https://url/mentions/abcde`,
      containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
      productId: 'chat',
    });
    const subscribeSpy = jest.spyOn(mentionResource, 'subscribe');

    const CONTAINER_ID = 'container-id';
    const OBJECT_ID = 'object-id';

    const mentionProvider = Promise.resolve(mentionResource);
    const contextIdentifierProvider = Promise.resolve({
      containerId: CONTAINER_ID,
      objectId: OBJECT_ID,
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
      subscribeSpy.mockReset();
    });

    it('should have contextIdentifiers in the state after component is mounted', () => {
      return new Promise(resolve => setTimeout(resolve)).then(() => {
        expect(component.state().contextIdentifierProvider).toEqual({
          containerId: CONTAINER_ID,
          objectId: OBJECT_ID,
        });
        expect(
          component.state().mentionProvider instanceof ContextMentionResource,
        ).toBeTruthy();
        expect(
          (component.state()
            .mentionProvider as ContextMentionResource).getContextIdentifier(),
        ).toEqual({
          containerId: CONTAINER_ID,
          objectId: OBJECT_ID,
        });
      });
    });

    it('should update contextIdentifiers after contextIds changed', () => {
      expect(component.state().contextIdentifierProvider).toEqual({
        containerId: CONTAINER_ID,
        objectId: OBJECT_ID,
      });
      component.setProps({
        contextIdentifierProvider: Promise.resolve({
          containerId: 'Yay',
          objectId: OBJECT_ID,
        }),
      });

      // To be able to see the proper expect failure and not a timeout, the expectation is wrappered in the code bellow to run verify the result in the next tick
      // given the setState() triggered in the MentionPicker.componentWillReceiveProps is async
      return new Promise(resolve => setTimeout(resolve)).then(() => {
        expect(
          component.state().mentionProvider instanceof ContextMentionResource,
        ).toBeTruthy();
        expect(
          (component.state()
            .mentionProvider as ContextMentionResource).getContextIdentifier(),
        ).toEqual({
          containerId: 'Yay',
          objectId: OBJECT_ID,
        });
        expect(component.state().contextIdentifierProvider).toEqual({
          containerId: 'Yay',
          objectId: OBJECT_ID,
        });
      });
    });

    it('should pass contextIdentifiers to new MentionProvider after update', () => {
      const newMentionResource = new MentionResource({
        url: `https://url/mentions/xyzw`,
        containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
        productId: 'chat',
      });
      component.setProps({
        mentionProvider: Promise.resolve(newMentionResource),
      });

      // To be able to see the proper expect failure and not a timeout, the expectation is wrappered in the code bellow to run verify the result in the next tick
      // given the setState() triggered in the MentionPicker.componentWillReceiveProps is async
      return new Promise(resolve => setTimeout(resolve)).then(() => {
        expect(
          component.state().mentionProvider instanceof ContextMentionResource,
        ).toBeTruthy();
        expect(
          (component.state()
            .mentionProvider as ContextMentionResource).getContextIdentifier(),
        ).toEqual({
          containerId: CONTAINER_ID,
          objectId: OBJECT_ID,
        });
        expect(component.state().contextIdentifierProvider).toEqual({
          containerId: CONTAINER_ID,
          objectId: OBJECT_ID,
        });
      });
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
        subscribeSpy.mock.calls[0][1](mentions);
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
        subscribeSpy.mock.calls[0][1](mentions);
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
