// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import LoaderItem from '../components/LoaderItem';
import { Cell as StyledCell } from '../styled';

describe('TableTree', () => {
  const DELAY_BEFORE_ANIMATION_SHOWN = 500;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('LoaderItem (blackbox)', () => {
    it("doesn't render anything initially", () => {
      const wrapper = shallow(
        <LoaderItem
          isCompleting={false}
          onComplete={() => {}}
          delay={DELAY_BEFORE_ANIMATION_SHOWN}
        />,
      );
      expect(wrapper.type()).toBe(null);

      jest.runTimersToTime(DELAY_BEFORE_ANIMATION_SHOWN / 2);
      wrapper.update();

      expect(wrapper.type()).toBe(null);
    });

    it('renders the loader after a delay', () => {
      const wrapper = mount(
        <LoaderItem
          delay={DELAY_BEFORE_ANIMATION_SHOWN}
          isCompleting={false}
          onComplete={() => {}}
        />,
      );

      jest.runTimersToTime(DELAY_BEFORE_ANIMATION_SHOWN);
      wrapper.update();

      expect(wrapper.type()).not.toBe(null);
      const cell = wrapper.find(StyledCell);
      expect(cell).toHaveLength(1);
      expect(cell.props()).toHaveProperty('width', '100%');
      const spinner = cell.find(Spinner);
      expect(spinner).toHaveLength(1);
      expect(spinner.props()).toHaveProperty('isCompleting', false);
    });

    it('stops rendering the loader after its animation completes', () => {
      const onCompleteSpy = jest.fn();
      const wrapper = mount(
        <LoaderItem
          delay={DELAY_BEFORE_ANIMATION_SHOWN}
          isCompleting={false}
          onComplete={onCompleteSpy}
        />,
      );
      jest.runTimersToTime(DELAY_BEFORE_ANIMATION_SHOWN);
      wrapper.update();

      expect(wrapper.children()).toHaveLength(1);

      const spinner = wrapper.find(Spinner);
      wrapper.setProps({ isCompleting: true });
      wrapper.update();
      spinner.prop('onComplete')();
      wrapper.update();

      expect(onCompleteSpy).toHaveBeenCalled();
      expect(wrapper.children()).toHaveLength(0);
    });

    it("doesn't render the loader at all if completed immediately", () => {
      const onCompleteSpy = jest.fn();
      const wrapper = mount(
        <LoaderItem
          delay={DELAY_BEFORE_ANIMATION_SHOWN}
          isCompleting
          onComplete={onCompleteSpy}
        />,
      );

      jest.runTimersToTime(DELAY_BEFORE_ANIMATION_SHOWN);
      wrapper.update();

      expect(wrapper.children()).toHaveLength(0);
      expect(onCompleteSpy).toHaveBeenCalled();
    });

    it("doesn't render the loader at all if completed quickly", () => {
      const onCompleteSpy = jest.fn();
      const wrapper = mount(
        <LoaderItem
          delay={DELAY_BEFORE_ANIMATION_SHOWN}
          isCompleting={false}
          onComplete={onCompleteSpy}
        />,
      );

      jest.runTimersToTime(DELAY_BEFORE_ANIMATION_SHOWN / 2);
      wrapper.setProps({ isCompleting: true });
      wrapper.update();

      expect(onCompleteSpy).toHaveBeenCalled();
      expect(wrapper.children()).toHaveLength(0);

      jest.runTimersToTime(DELAY_BEFORE_ANIMATION_SHOWN);
      wrapper.update();

      expect(wrapper.children()).toHaveLength(0);
    });
  });
});
