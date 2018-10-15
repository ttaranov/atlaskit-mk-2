import { mount } from 'enzyme';
import * as React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { AnalyticsListener } from '@atlaskit/analytics';
import { AnalyticsListener as AnalyticsListenerNext } from '@atlaskit/analytics-next';
import { MentionStyle } from '../../../components/Mention/styles';
import { MentionType } from '../../../types';
import Mention, { ANALYTICS_HOVER_DELAY } from '../../../components/Mention';
import { ELEMENTS_CHANNEL } from '../../../constants';
import ResourcedMention from '../../../components/Mention/ResourcedMention';
import {
  mockMentionData as mentionData,
  mockMentionProvider as mentionProvider,
} from '../_test-helpers';

const createPayload = (actionSubject, action) => ({
  payload: {
    action,
    actionSubject,
    attributes: {
      packageName: '@atlaskit/mention',
      packageVersion: expect.any(String),
      componentName: 'mention',
      accessLevel: 'CONTAINER',
      isSpecial: false,
      userId: mentionData.id,
    },
    eventType: 'ui',
  },
});

describe('<Mention />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Mention', () => {
    it('should render based on mention data', () => {
      const mention = mount(<Mention {...mentionData} />);
      expect(mention.html()).toContain(mentionData.text);
    });

    it('should render a default lozenge if no accessLevel data and is not being mentioned', () => {
      const mention = mount(<Mention {...mentionData} />);
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.DEFAULT,
      );
    });

    it('should render a default lozenge if the user has CONTAINER permissions but is not being mentioned', () => {
      const mention = mount(
        <Mention {...mentionData} accessLevel={'CONTAINER'} />,
      );
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.DEFAULT,
      );
    });

    it('should add a highlighted lozenge if `isHighlighted` is set to true', () => {
      const mention = mount(<Mention {...mentionData} isHighlighted={true} />);
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.SELF,
      );
    });

    it('should render a restricted style lozenge if the user has non-CONTAINER permissions', () => {
      const mention = mount(<Mention {...mentionData} accessLevel={'NONE'} />);
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.RESTRICTED,
      );
    });

    it('should not display a tooltip if no accessLevel data', () => {
      const mention = mount(<Mention {...mentionData} />);
      expect(mention.find(Tooltip)).toHaveLength(0);
    });

    it('should display tooltip if mentioned user does not have container permission', () => {
      const mention = mount(<Mention {...mentionData} accessLevel="NONE" />);
      expect(mention.find(Tooltip)).toHaveLength(1);
    });

    it('should not display tooltip if mention is highlighted', () => {
      const mention = mount(<Mention {...mentionData} isHighlighted={true} />);
      expect(mention.find(Tooltip)).toHaveLength(0);
    });

    it('should dispatch onClick-event', () => {
      const spy = jest.fn();
      const mention = mount(<Mention {...mentionData} onClick={spy} />);
      mention.find(MentionStyle).simulate('click');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
        expect.anything(),
      );
    });

    it('should dispatch lozenge.select analytics onClick-event', () => {
      const analyticsSpy = jest.fn();
      const analyticsNextHandlerSpy = jest.fn();
      const mention = mount(
        <AnalyticsListenerNext
          onEvent={analyticsNextHandlerSpy}
          channel={ELEMENTS_CHANNEL}
        >
          <AnalyticsListener onEvent={analyticsSpy} matchPrivate={true}>
            <Mention {...mentionData} accessLevel={'CONTAINER'} />
          </AnalyticsListener>
        </AnalyticsListenerNext>,
      );
      mention.find(MentionStyle).simulate('click');
      expect(analyticsSpy).toBeCalled();
      expect(analyticsSpy).toHaveBeenCalledWith(
        'atlassian.fabric.mention.lozenge.select',
        { accessLevel: 'CONTAINER', isSpecial: false },
      );

      expect(analyticsNextHandlerSpy).toHaveBeenCalledWith(
        expect.objectContaining(createPayload('mention', 'selected')),
        ELEMENTS_CHANNEL,
      );
    });

    it('should dispatch onMouseEnter-event', () => {
      const spy = jest.fn();
      const mention = mount(<Mention {...mentionData} onMouseEnter={spy} />);
      mention.find(MentionStyle).simulate('mouseenter');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });

    it('should dispatch onMouseLeave-event', () => {
      const spy = jest.fn();
      const mention = mount(<Mention {...mentionData} onMouseLeave={spy} />);
      mention.find(MentionStyle).simulate('mouseleave');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });

    it('should dispatch lozenge.hover analytics event if hover delay is greater than the threshold', () => {
      const analyticsSpy = jest.fn();
      const analyticsNextHandlerSpy = jest.fn();
      const mention = mount(
        <AnalyticsListenerNext
          onEvent={analyticsNextHandlerSpy}
          channel={ELEMENTS_CHANNEL}
        >
          <AnalyticsListener onEvent={analyticsSpy} matchPrivate={true}>
            <Mention {...mentionData} accessLevel={'CONTAINER'} />
          </AnalyticsListener>
        </AnalyticsListenerNext>,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      jest.runTimersToTime(ANALYTICS_HOVER_DELAY);

      expect(analyticsSpy).toBeCalled();
      expect(analyticsSpy).toHaveBeenCalledWith(
        'atlassian.fabric.mention.lozenge.hover',
        { accessLevel: 'CONTAINER', isSpecial: false },
      );

      expect(analyticsNextHandlerSpy).toHaveBeenCalledWith(
        expect.objectContaining(createPayload('mention', 'hovered')),
        ELEMENTS_CHANNEL,
      );
    });

    it('should not dispatch lozenge.hover analytics event for a hover delay bellow the threshold', () => {
      const analyticsSpy = jest.fn();
      const analyticsNextHandlerSpy = jest.fn();
      const mention = mount(
        <AnalyticsListenerNext
          onEvent={analyticsNextHandlerSpy}
          channel={ELEMENTS_CHANNEL}
        >
          <AnalyticsListener onEvent={analyticsSpy} matchPrivate={true}>
            <Mention {...mentionData} accessLevel={'CONTAINER'} />
          </AnalyticsListener>
        </AnalyticsListenerNext>,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      jest.runTimersToTime(ANALYTICS_HOVER_DELAY / 5);
      mention.find(MentionStyle).simulate('mouseleave');

      // to make sure the clearTimeout removed the scheduled task
      jest.runTimersToTime(ANALYTICS_HOVER_DELAY);

      expect(analyticsSpy).not.toBeCalled();
      expect(analyticsNextHandlerSpy).not.toBeCalled();
    });

    it('should render a stateless mention component with correct data attributes', () => {
      const mention = mount(<Mention {...mentionData} accessLevel="NONE" />);
      expect(
        mention.getDOMNode().attributes.getNamedItem('data-mention-id')!.value,
      ).toEqual(mentionData.id);
      expect(
        mention.getDOMNode().attributes.getNamedItem('data-access-level')!
          .value,
      ).toEqual('NONE');
    });

    it('should have spell check disabled', () => {
      const mention = mount(<Mention {...mentionData} />);
      expect(
        mention.getDOMNode().attributes.getNamedItem('spellcheck')!.value,
      ).toEqual('false');
    });
  });

  describe('ResourcedMention', () => {
    it('should render a stateless mention component based on mention data', () => {
      const mention = mount(
        <ResourcedMention {...mentionData} mentionProvider={mentionProvider} />,
      );
      expect(
        mention
          .find(Mention)
          .first()
          .text(),
      ).toEqual(mentionData.text);
    });

    it('should render a highlighted stateless mention component if mentionProvider.shouldHighlightMention returns true', async () => {
      const mention = mount(
        <ResourcedMention
          id="oscar"
          text="@Oscar Wallhult"
          mentionProvider={mentionProvider}
        />,
      );

      await mentionProvider;
      mention.update();
      expect(
        mention
          .find(Mention)
          .first()
          .find(MentionStyle)
          .prop('mentionType'),
      ).toEqual(MentionType.SELF);
    });

    it('should not render highlighted mention component if there is no mentionProvider', () => {
      const mention = mount(
        <ResourcedMention id="oscar" text="@Oscar Wallhult" />,
      );
      expect(
        mention
          .find(Mention)
          .first()
          .find(MentionStyle)
          .prop('mentionType'),
      ).toEqual(MentionType.DEFAULT);
    });

    it('should dispatch onClick-event', () => {
      const spy = jest.fn();
      const mention = mount(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider}
          onClick={spy}
        />,
      );
      mention.find(MentionStyle).simulate('click');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
        expect.anything(),
      );
    });

    it('should dispatch onMouseEnter-event', () => {
      const spy = jest.fn();
      const mention = mount(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider}
          onMouseEnter={spy}
        />,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });

    it('should dispatch onMouseLeave-event', () => {
      const spy = jest.fn();
      const mention = mount(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider}
          onMouseLeave={spy}
        />,
      );
      mention.find(MentionStyle).simulate('mouseleave');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });
  });
});
