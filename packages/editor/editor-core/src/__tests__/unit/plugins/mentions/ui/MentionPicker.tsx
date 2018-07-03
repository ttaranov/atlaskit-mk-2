import * as React from 'react';
import { shallow } from 'enzyme';
import { MentionResource } from '@atlaskit/mention';
import { EditorView } from 'prosemirror-view';
import { MentionPicker } from '../../../../../plugins/mentions/ui/MentionPicker';
import { analyticsService } from '../../../../../analytics';

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
      trackEvent = jest.spyOn(analyticsService, 'trackEvent');
      state = {
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
      };
      createAnalyticsEvent.mockReset();

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
    });

    afterEach(() => {
      trackEvent.mockRestore();
      component.unmount();
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
  });
});
