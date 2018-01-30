// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import LoaderItem from '../components/LoaderItem';
import { Cell as StyledCell } from '../styled';

describe('TableTree', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('LoaderItem', () => {
    it('starts in the delaying phase', () => {
      const wrapper = shallow(
        <LoaderItem isCompleting={false} onComplete={() => {}} />,
      );
      expect(wrapper.state()).toHaveProperty('phase', 'delaying');
    });

    it('renders a loader in the loading phase', () => {
      const wrapper = mount(
        <LoaderItem isCompleting={false} onComplete={() => {}} />,
      );
      const instance = wrapper.instance();
      instance.setState({ phase: 'loading' });
      wrapper.update();

      const cell = wrapper.find(StyledCell);
      expect(cell).toHaveLength(1);
      expect(cell.props()).toHaveProperty('width', '100%');

      const spinner = cell.find(Spinner);
      expect(spinner).toHaveLength(1);
    });

    it('does not render the loader in the delaying phase', () => {
      const wrapper = mount(
        <LoaderItem isCompleting={false} onComplete={() => {}} />,
      );
      const instance = wrapper.instance();
      instance.setState({ phase: 'delaying' });
      wrapper.update();

      expect(wrapper.find(StyledCell)).toHaveLength(0);
      expect(wrapper.find(Spinner)).toHaveLength(0);
    });

    it('does not render the loader in the complete phase', () => {
      const wrapper = mount(
        <LoaderItem isCompleting={false} onComplete={() => {}} />,
      );
      const instance = wrapper.instance();
      instance.setState({ phase: 'complete' });
      wrapper.update();

      expect(wrapper.find(StyledCell)).toHaveLength(0);
      expect(wrapper.find(Spinner)).toHaveLength(0);
    });

    it('enters the loading phase after the delay has passed', () => {
      const DELAY = 500;
      const wrapper = shallow(
        <LoaderItem delay={DELAY} isCompleting={false} onComplete={() => {}} />,
      );
      const instance = wrapper.instance();
      jest.runTimersToTime(DELAY / 2);

      expect(instance.state).toHaveProperty('phase', 'delaying');

      jest.runTimersToTime(DELAY);
      expect(instance.state).toHaveProperty('phase', 'loading');
    });

    it('enters the complete phase when was delaying and isComplete was set to true', () => {
      const wrapper = shallow(
        <LoaderItem isCompleting={false} onComplete={() => {}} />,
      );
      const instance = wrapper.instance();
      instance.setState({ phase: 'delaying' });
      wrapper.update();

      wrapper.setProps({ isCompleting: true });
      expect(wrapper.state()).toHaveProperty('phase', 'complete');
    });
  });
});
