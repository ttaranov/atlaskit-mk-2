// @flow
import React from 'react';
import { mount } from 'enzyme';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Chevron from '../components/Chevron';
import { iconColorFocus } from '../styled';

const controlledId = 'controlled_element_id';

const findIcon = chevron =>
  chevron.findWhere(e => e.is(ChevronDownIcon) || e.is(ChevronRightIcon));
const isHighlighted = chevron =>
  findIcon(chevron).props().primaryColor === iconColorFocus;

test('accessibility', () => {
  const wrapper = mount(
    <Chevron ariaControls={controlledId} isExpanded={false} />,
  );
  const button = wrapper.find('button');
  expect(button).toHaveLength(1);
  expect(button.props()).toHaveProperty('aria-controls', controlledId);
});

test('expanded', () => {
  const wrapper = mount(<Chevron ariaControls={controlledId} isExpanded />);
  const button = wrapper.find('button');
  expect(button.find(ChevronRightIcon)).toHaveLength(0);
  expect(button.find(ChevronDownIcon)).toHaveLength(1);
});

test('collapsed', () => {
  const wrapper = mount(
    <Chevron ariaControls={controlledId} isExpanded={false} />,
  );
  const button = wrapper.find('button');
  expect(button.find(ChevronRightIcon)).toHaveLength(1);
  expect(button.find(ChevronDownIcon)).toHaveLength(0);
});

test('onExpandToggle', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Chevron
      ariaControls={controlledId}
      isExpanded={false}
      onExpandToggle={spy}
    />,
  );
  const button = wrapper.find('button');
  button.simulate('click');
  expect(spy).toHaveBeenCalled();
});

test('no highlight initially', () => {
  const wrapper = mount(
    <Chevron ariaControls={controlledId} isExpanded={false} />,
  );
  expect(isHighlighted(wrapper)).toBe(false);
});

test('highlight on focus', () => {
  const wrapper = mount(
    <Chevron ariaControls={controlledId} isExpanded={false} />,
  );
  const button = wrapper.find('button');

  button.simulate('focus');
  expect(isHighlighted(wrapper)).toBe(true);

  button.simulate('blur');
  expect(isHighlighted(wrapper)).toBe(false);
});

test('highlight on hover', () => {
  const wrapper = mount(
    <Chevron ariaControls={controlledId} isExpanded={false} />,
  );
  const button = wrapper.find('button');

  button.simulate('focus');
  expect(isHighlighted(wrapper)).toBe(true);

  button.simulate('blur');
  expect(isHighlighted(wrapper)).toBe(false);
});
