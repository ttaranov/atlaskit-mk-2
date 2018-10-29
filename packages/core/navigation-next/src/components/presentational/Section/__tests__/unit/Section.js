// @flow

import React from 'react';
import { mount } from 'enzyme';

import {
  StaticTransitionGroup,
  ScrollableTransitionGroup,
  ScrollableWrapper,
  ScrollableInner,
  StaticWrapper,
} from '../../Section';
import Section from '../../';
import { transitionDurationMs } from '../../../../../common/constants';

describe('Section', () => {
  it('should use defaults for transition animations', () => {
    const section = mount(<Section>{() => <div>Hello world</div>}</Section>);
    expect(section.find('Transition').props().timeout).toBe(
      transitionDurationMs,
    );
  });

  it('should wrap its children with an internally scrollable div when shouldGrow is true', () => {
    const notScrollable = mount(
      <Section>{() => <div>Hello world</div>}</Section>,
    );
    const scrollable = mount(
      <Section shouldGrow>{() => <div>Hello world</div>}</Section>,
    );

    expect(
      notScrollable.find(StaticTransitionGroup).find(StaticWrapper),
    ).toHaveLength(1);
    expect(scrollable.find(StaticWrapper)).toHaveLength(0);

    expect(
      scrollable
        .find(ScrollableTransitionGroup)
        .find(ScrollableWrapper)
        .find(ScrollableInner),
    ).toHaveLength(1);
    expect(scrollable.find(StaticWrapper)).toHaveLength(0);
  });
});
