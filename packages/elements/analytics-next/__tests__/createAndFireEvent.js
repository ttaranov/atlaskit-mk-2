// @flow

import React, { type Node } from 'react';
import { mount } from 'enzyme';
import {
  createAndFireEvent,
  withAnalyticsEvents,
  AnalyticsListener,
} from '../src';

type Props = {
  onClick?: () => void,
  children: Node,
};

const Button = ({ onClick, children }: Props) => (
  <button onClick={onClick}>{children}</button>
);

it('should create and fire analytics event', () => {
  const onEvent = jest.fn();
  const createAndFireOnAtlaskit = createAndFireEvent('atlaskit');
  const ButtonWithAnalytics = withAnalyticsEvents({
    onClick: createAndFireOnAtlaskit({ action: 'click' }),
  })(Button);
  mount(
    <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
      <ButtonWithAnalytics>Clicky</ButtonWithAnalytics>
    </AnalyticsListener>,
  )
    .find(Button)
    .simulate('click');
  expect(onEvent).toHaveBeenCalled();
});
