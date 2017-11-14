import * as React from 'react';
import { shallow } from 'enzyme';
import ApplicationCard from '../../../../src/renderer/react/nodes/applicationCard';
import { AppCardView } from '@atlaskit/media-card';
import { EventHandlers } from '../../../../src/ui/Renderer';
import * as sinon from 'sinon';

describe('Renderer - React/Nodes/ApplicationCard', () => {

  let applicationCard;
  let spyOnClick;
  let spyOnActionClick;

  const actions = [
    {
      title: 'test',
      target: {
        app: 'some.app',
        key: 'test.target'
      },
      parameters: {
        expenseId: 'some-id'
      }
    }
  ];

  beforeEach(() => {
    spyOnClick = sinon.spy();
    spyOnActionClick = sinon.spy();
    const eventHandlers: EventHandlers = {
      applicationCard: {
        onClick: spyOnClick,
        onActionClick: spyOnActionClick
      }
    };
    const attrs = {
      text: 'applicationCard',
      title: {
        text: 'applicationCard'
      },
      link: {
        url: 'link-url'
      },
      actions: actions
    };
    applicationCard = shallow(
      <ApplicationCard
        eventHandlers={eventHandlers}
        {...attrs}
      />
    );
  });

  it('should wrap content with <AppCardView>-tag', () => {
    expect(applicationCard.find(AppCardView).length).toBe(1);
  });

  it('should pass onActionClick to AppCardView', () => {
    expect(applicationCard.find(AppCardView).prop('onActionClick')).toEqual(spyOnActionClick);
  });

  it('should pass actions to AppCardView', () => {
    expect(applicationCard.find(AppCardView).prop('model').actions).toEqual(actions);
  });

  it('should call onClick with link.url', () => {
    applicationCard.simulate('click');
    expect(spyOnClick.callCount).toEqual(1);
    expect(spyOnClick.calledWith('link-url')).toBe(true);
  });

});
