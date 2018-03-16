import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ApplicationCard from '../../../../src/react/nodes/applicationCard';
import { AppCardView } from '@atlaskit/media-card';
import { EventHandlers } from '@atlaskit/editor-common';
import * as sinon from 'sinon';

describe('Renderer - React/Nodes/ApplicationCard', () => {
  let applicationCard;
  let spyOnClick;
  let spyOnActionClick;

  const actions = [
    {
      title: 'test',
      target: {
        receiver: 'some.app',
        key: 'test.target',
      },
      parameters: {
        expenseId: 'some-id',
      },
    },
  ];

  beforeEach(() => {
    spyOnClick = sinon.spy();
    spyOnActionClick = sinon.spy();
    const eventHandlers: EventHandlers = {
      applicationCard: {
        onClick: spyOnClick,
        onActionClick: spyOnActionClick,
      },
    };
    const attrs = {
      text: 'applicationCard',
      title: {
        text: 'applicationCard',
      },
      link: {
        url: 'link-url',
      },
      actions: actions,
    };
    applicationCard = shallow(
      <ApplicationCard
        eventHandlers={eventHandlers}
        useNewApplicationCard={true}
        {...attrs}
      />,
    );
  });

  it('should wrap content with <AppCardView>-tag', () => {
    expect(applicationCard.find(AppCardView)).to.have.length(1);
  });

  it('should pass onActionClick to AppCardView', () => {
    expect(applicationCard.find(AppCardView).prop('onActionClick')).to.equal(
      spyOnActionClick,
    );
  });

  it('should pass actions to AppCardView', () => {
    expect(applicationCard.find(AppCardView).prop('model').actions).to.equal(
      actions,
    );
  });

  it('should call onClick with link.url', () => {
    applicationCard.find(AppCardView).simulate('click');
    expect(spyOnClick.callCount).to.equal(1);
    expect(spyOnClick.calledWith('link-url')).to.equal(true);
  });

  it('should pass useNewApplicationCard to AppCardView', () => {
    expect(applicationCard.find(AppCardView).prop('newDesign')).to.equal(true);
  });
});
