import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Tooltip from '@atlaskit/tooltip';
import { AnalyticsListener } from '@atlaskit/analytics';
import { MentionStyle } from '../../../src/components/Mention/styles';
import { MentionType } from '../../../src/types';
import Mention from '../../../src/components/Mention';
import ResourcedMention from '../../../src/components/Mention/ResourcedMention';
import { mentionData, mentionProvider } from '../_mock-mention-provider';

describe('<Mention />', () => {
  describe('Mention', () => {
    it('should render based on mention data', () => {
      const mention = mount(<Mention {...mentionData} />);
      expect(mention.html()).to.contain(mentionData.text);
    });

    it('should render a default lozenge if no accessLevel data and is not being mentioned', () => {
      const mention = mount(<Mention {...mentionData} />);
      expect(mention.find(MentionStyle).prop('mentionType')).to.equal(
        MentionType.DEFAULT,
      );
    });

    it('should render a default lozenge if the user has CONTAINER permissions but is not being mentioned', () => {
      const mention = mount(
        <Mention {...mentionData} accessLevel={'CONTAINER'} />,
      );
      expect(mention.find(MentionStyle).prop('mentionType')).to.equal(
        MentionType.DEFAULT,
      );
    });

    it('should add a highlighted lozenge if `isHighlighted` is set to true', () => {
      const mention = mount(<Mention {...mentionData} isHighlighted={true} />);
      expect(mention.find(MentionStyle).prop('mentionType')).to.equal(
        MentionType.SELF,
      );
    });

    it('should render a restricted style lozenge if the user has non-CONTAINER permissions', () => {
      const mention = mount(<Mention {...mentionData} accessLevel={'NONE'} />);
      expect(mention.find(MentionStyle).prop('mentionType')).to.equal(
        MentionType.RESTRICTED,
      );
    });

    it('should not display a tooltip if no accessLevel data', () => {
      const mention = mount(<Mention {...mentionData} />);
      expect(mention.find(Tooltip).length).to.equal(0);
    });

    it('should display tooltip if mentioned user does not have container permission', () => {
      const mention = mount(<Mention {...mentionData} accessLevel="NONE" />);
      expect(mention.find(Tooltip).length).to.equal(1);
    });

    it('should not display tooltip if mention is highlighted', () => {
      const mention = mount(<Mention {...mentionData} isHighlighted={true} />);
      expect(mention.find(Tooltip).length).to.equal(0);
    });

    it('should dispatch onClick-event', () => {
      const spy = sinon.spy();
      const mention = mount(<Mention {...mentionData} onClick={spy} />);
      mention.find(MentionStyle).simulate('click');
      expect(spy.called).to.equal(true);
      expect(spy.calledWith(mentionData.id, mentionData.text)).to.equal(true);
    });

    it('should dispatch lozenge.select analytics onClick-event', () => {
      const analyticsSpy = sinon.spy();
      const mention = mount(
        <AnalyticsListener onEvent={analyticsSpy} matchPrivate={true}>
          <Mention {...mentionData} accessLevel={'CONTAINER'} />
        </AnalyticsListener>,
      );
      mention.find(MentionStyle).simulate('click');
      expect(analyticsSpy.called).to.equal(true);
      expect(
        analyticsSpy.calledWith('atlassian.fabric.mention.lozenge.select', {
          accessLevel: 'CONTAINER',
          isSpecial: false,
        }),
      ).to.equal(true);
    });

    it('should dispatch onMouseEnter-event', () => {
      const spy = sinon.spy();
      const mention = mount(<Mention {...mentionData} onMouseEnter={spy} />);
      mention.find(MentionStyle).simulate('mouseenter');
      expect(spy.called).to.equal(true);
      expect(spy.calledWith(mentionData.id, mentionData.text)).to.equal(true);
    });

    it('should dispatch onMouseLeave-event', () => {
      const spy = sinon.spy();
      const mention = mount(<Mention {...mentionData} onMouseLeave={spy} />);
      mention.find(MentionStyle).simulate('mouseleave');
      expect(spy.called).to.equal(true);
      expect(spy.calledWith(mentionData.id, mentionData.text)).to.equal(true);
    });

    it('should dispatch lozenge.hover analytics onMouseLeave-event', () => {
      const analyticsSpy = sinon.spy();
      const mention = mount(
        <AnalyticsListener onEvent={analyticsSpy} matchPrivate={true}>
          <Mention {...mentionData} accessLevel={'CONTAINER'} />
        </AnalyticsListener>,
      );
      mention.find(MentionStyle).simulate('mouseleave');
      expect(analyticsSpy.called).to.equal(true);
      // note:  Mention.startTime (private attribute) is zero initially so firing mouseleave event here is enough to get over 1000ms
      //        Refer to onMouseLeave() code
      expect(
        analyticsSpy.calledWith('atlassian.fabric.mention.lozenge.hover', {
          accessLevel: 'CONTAINER',
          isSpecial: false,
        }),
      ).to.equal(true);
    });

    it('should render a stateless mention component with correct data attributes', () => {
      const mention = mount(<Mention {...mentionData} accessLevel="NONE" />);
      expect(
        mention.getDOMNode().attributes.getNamedItem('data-mention-id').value,
      ).to.equal(mentionData.id);
      expect(
        mention.getDOMNode().attributes.getNamedItem('data-access-level').value,
      ).to.equal('NONE');
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
      ).to.equal(mentionData.text);
    });

    it('should render a highlighted statless mention component if mentionProvider.shouldHighlightMention returns true', async () => {
      const mention = mount(
        <ResourcedMention
          id="oscar"
          text="@Oscar Wallhult"
          mentionProvider={mentionProvider}
        />,
      );

      await mentionProvider;
      expect(
        mention
          .find(Mention)
          .first()
          .find(MentionStyle)
          .prop('mentionType'),
      ).to.equal(MentionType.SELF);
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
      ).to.equal(MentionType.DEFAULT);
    });

    it('should dispatch onClick-event', () => {
      const spy = sinon.spy();
      const mention = mount(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider}
          onClick={spy}
        />,
      );
      mention.find(MentionStyle).simulate('click');
      expect(spy.called).to.equal(true);
      expect(spy.calledWith(mentionData.id, mentionData.text)).to.equal(true);
    });

    it('should dispatch onMouseEnter-event', () => {
      const spy = sinon.spy();
      const mention = mount(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider}
          onMouseEnter={spy}
        />,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      expect(spy.called).to.equal(true);
      expect(spy.calledWith(mentionData.id, mentionData.text)).to.equal(true);
    });

    it('should dispatch onMouseLeave-event', () => {
      const spy = sinon.spy();
      const mention = mount(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider}
          onMouseLeave={spy}
        />,
      );
      mention.find(MentionStyle).simulate('mouseleave');
      expect(spy.called).to.equal(true);
      expect(spy.calledWith(mentionData.id, mentionData.text)).to.equal(true);
    });
  });
});
