// @flow
import React from 'react';
import { mount } from 'enzyme';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Chevron from '../components/Chevron';
import { iconColorFocus } from '../styled';

const controlledId = 'controlled_element_id';

describe('TableTree', () => {
  describe('Chevron', () => {
    it('renders an accessible button', () => {
      const wrapper = mount(
        <Chevron ariaControls={controlledId} isExpanded={false} />,
      );
      const button = wrapper.find('button');
      expect(button).toHaveLength(1);
      expect(button.props()).toHaveProperty('aria-controls', controlledId);
    });

    it('renders a collapse button when expanded', () => {
      const wrapper = mount(<Chevron ariaControls={controlledId} isExpanded />);
      const button = wrapper.find('button');
      expect(button.find(ChevronRightIcon)).toHaveLength(0);
      expect(button.find(ChevronDownIcon)).toHaveLength(1);
    });

    it('renders an expand button when collapsed', () => {
      const wrapper = mount(
        <Chevron ariaControls={controlledId} isExpanded={false} />,
      );
      const button = wrapper.find('button');
      expect(button.find(ChevronRightIcon)).toHaveLength(1);
      expect(button.find(ChevronDownIcon)).toHaveLength(0);
    });

    it('calls onExpandToggle when clicked', () => {
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

    it('is not highlighted initially', () => {
      const wrapper = mount(
        <Chevron ariaControls={controlledId} isExpanded={false} />,
      );
      expect(isHighlighted(wrapper)).toBe(false);
    });

    it('gets highlighted when focused', () => {
      const wrapper = mount(
        <Chevron ariaControls={controlledId} isExpanded={false} />,
      );
      const button = wrapper.find('button');

      button.simulate('focus');
      expect(isHighlighted(wrapper)).toBe(true);

      button.simulate('blur');
      expect(isHighlighted(wrapper)).toBe(false);
    });

    it('gets highlighted when hovered', () => {
      const wrapper = mount(
        <Chevron ariaControls={controlledId} isExpanded={false} />,
      );
      const button = wrapper.find('button');

      button.simulate('focus');
      expect(isHighlighted(wrapper)).toBe(true);

      button.simulate('blur');
      expect(isHighlighted(wrapper)).toBe(false);
    });

    function isHighlighted(chevron) {
      return (
        chevron
          .findWhere(e => e.is(ChevronDownIcon) || e.is(ChevronRightIcon))
          .props().primaryColor === iconColorFocus
      );
    }
  });
});
