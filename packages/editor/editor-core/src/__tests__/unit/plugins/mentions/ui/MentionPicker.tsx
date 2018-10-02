import AkMentionPicker, {
  MentionDescription,
  MentionResource,
  ContextMentionResource,
} from '@atlaskit/mention';

import { shallow } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import { analyticsService } from '../../../../../analytics';
import { enter } from '../../../../../keymaps';
import { MentionPicker } from '../../../../../plugins/mentions/ui/MentionPicker';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

const sessionIdRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

const extractSessionId = <T extends any>(
  createAnalyticsEvent: jest.Mock<T>,
  callIndex: number = 0,
) => createAnalyticsEvent.mock.calls[callIndex][0].attributes.sessionId;

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

    const newMentionResource = new MentionResource({
      url: `https://url/mentions/xyzw`,
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
          sessionId: expect.stringMatching(sessionIdRegex),
        });
      });
    });

    it('should use ContextMentionResource with sessionId if contextIdentifierProvider fails after component is mounted', () => {
      const _component = shallow(
        <MentionPicker
          mentionProvider={mentionProvider}
          contextIdentifierProvider={Promise.reject(new Error('Boo failure'))}
          pluginKey={pluginKey}
          editorView={editorView}
          createAnalyticsEvent={createAnalyticsEvent}
        />,
      );
      return new Promise(resolve => setTimeout(resolve)).then(() => {
        expect(_component.state().contextIdentifierProvider).toEqual(undefined);
        const mentionResource = _component.state()
          .mentionProvider as ContextMentionResource;

        expect(mentionResource instanceof ContextMentionResource).toBeTruthy();
        expect(mentionResource.getContextIdentifier()).toEqual({
          sessionId: expect.stringMatching(sessionIdRegex),
        });
      });
    });

    it('should update contextIdentifiers after contextIds changed', () => {
      component.setProps({
        contextIdentifierProvider: Promise.resolve({
          containerId: 'whatever',
          objectId: 'boo',
          childObjectId: 'boo child',
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
          containerId: 'whatever',
          objectId: 'boo',
          childObjectId: 'boo child',
          sessionId: expect.stringMatching(sessionIdRegex),
        });
        expect(component.state().contextIdentifierProvider).toEqual({
          containerId: 'whatever',
          objectId: 'boo',
          childObjectId: 'boo child',
        });
      });
    });

    it('should pass contextIdentifiers to new MentionProvider after update', () => {
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
          sessionId: expect.stringMatching(sessionIdRegex),
        });
        expect(component.state().contextIdentifierProvider).toEqual({
          containerId: CONTAINER_ID,
          objectId: OBJECT_ID,
        });
      });
    });

    it('should update state after both contextIds/mentionProvider changed', () => {
      component.setProps({
        mentionProvider: Promise.resolve(newMentionResource),
        contextIdentifierProvider: Promise.resolve({
          containerId: 'Foo',
          objectId: 'Boo',
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
          containerId: 'Foo',
          objectId: 'Boo',
          sessionId: expect.stringMatching(sessionIdRegex),
        });
        expect(component.state().contextIdentifierProvider).toEqual({
          containerId: 'Foo',
          objectId: 'Boo',
        });
      });
    });

    it('should update state with mentionProvider after both contextIds/mentionProvider changed and contextIdentifierProvider failed', () => {
      component.setProps({
        mentionProvider: Promise.resolve(newMentionResource),
        contextIdentifierProvider: Promise.reject(new Error('Boo again')),
      });

      // To be able to see the proper expect failure and not a timeout, the expectation is wrappered in the code bellow to run verify the result in the next tick
      // given the setState() triggered in the MentionPicker.componentWillReceiveProps is async
      return new Promise(resolve => setTimeout(resolve)).then(() => {
        const mentionProvider = component.state()
          .mentionProvider as ContextMentionResource;

        expect(mentionProvider instanceof ContextMentionResource).toBeTruthy();
        expect(mentionProvider.getContextIdentifier()).toEqual({
          sessionId: expect.stringMatching(sessionIdRegex),
        });
        expect(component.state().contextIdentifierProvider).toEqual(undefined);
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
            actionSubject: 'mentionTypeahead',
            eventType: 'ui',
            source: 'unknown',
            attributes: expect.objectContaining({
              packageName: '@atlaskit/editor-core',
              packageVersion: expect.any(String),
              sessionId: expect.stringMatching(sessionIdRegex),
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
        subscribeSpy.mock.calls[0][1](mentions);
        state.lastQuery = 'someQuery';
        state.onSelectNext();
        state.onSelectNext();
        state.onSelectPrevious();
        state.onSelectCurrent(enter.common);
        (componentInstance as any).handleSelectedMention(mention);
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'pressed',
            actionSubject: 'mentionTypeahead',
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
            actionSubject: 'mentionTypeahead',
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

      describe('sessionId', () => {
        it('should render FabricElementsAnalyticsContext with sessionId', () => {
          state.subscribe.mock.calls[0][0]({
            ...state,
            queryActive: true,
            focused: true,
            anchorElement: {},
            query: '',
          });
          component.update();

          const elementsAnalyticsCtx = component.find(
            FabricElementsAnalyticsContext,
          );

          expect(elementsAnalyticsCtx).toHaveLength(1);

          const sessionId = elementsAnalyticsCtx.props().data.sessionId;

          expect(sessionId).toBeDefined();
          expect(sessionId).toEqual(expect.stringMatching(sessionIdRegex));
        });

        it('should recreate sessionId when first session is dismissed', () => {
          state.subscribe.mock.calls[0][0]({
            ...state,
            queryActive: true,
            focused: true,
            anchorElement: {},
            query: '',
          });

          component.update();

          expect(component.find(AkMentionPicker)).toHaveLength(1);

          state.subscribe.mock.calls[0][0]({
            ...state,
            queryActive: false,
            focused: false,
          });
          state.onDismiss();
          component.update();

          expect(component.find(AkMentionPicker)).toHaveLength(0);

          expect(createAnalyticsEvent).toHaveBeenCalledTimes(1);
          const firstSessionId = extractSessionId(createAnalyticsEvent);
          expect(firstSessionId).toMatch(sessionIdRegex);

          state.subscribe.mock.calls[0][0]({
            ...state,
            queryActive: false,
            focused: false,
          });
          state.onDismiss();
          component.update();

          expect(createAnalyticsEvent).toHaveBeenCalledTimes(2);
          const secondSessionId = extractSessionId(createAnalyticsEvent, 1);

          expect(firstSessionId).not.toEqual(secondSessionId);
          expect(secondSessionId).toMatch(sessionIdRegex);
        });
      });
    });
  });
});
