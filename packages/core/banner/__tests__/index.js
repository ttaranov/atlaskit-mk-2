// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../src';
import {
  backgroundColor,
  getMaxHeight,
  textColor,
  testErrorBackgroundColor,
  testErrorTextColor,
  Container,
  Text,
} from '../src/styled';

describe('banner', () => {
  it('basic sanity check', () =>
    expect(shallow(<Banner />)).not.toBe(undefined));

  describe('props', () => {
    describe('appearance prop', () => {
      it('should default to warning appearance', () =>
        expect(mount(<Banner />).prop('appearance')).toBe('warning'));
      it('should apply error styles when error appearance supplied', () => {
        const props = { appearance: 'error' };
        // $FlowFixMe TEMPORARY FIXME
        expect(backgroundColor(props)).toBe(testErrorBackgroundColor);
        // $FlowFixMe TEMPORARY FIXME
        expect(textColor(props)).toBe(testErrorTextColor);
      });
    });

    it('should render children prop', () => {
      const wrapper = mount(<Banner>Testing!</Banner>);
      expect(wrapper.find(Text).text()).toBe('Testing!');
    });

    it('should render icon prop', () => {
      const wrapper = shallow(
        <Banner
          icon={<WarningIcon label="Warning" secondaryColor="inherit" />}
        />,
      );
      expect(wrapper.find(WarningIcon).exists()).toBe(true);
    });

    describe('isOpen prop', () => {
      it('should default to not being open', () =>
        expect(mount(<Banner />).prop('isOpen')).toBe(false));
      it('should apply a max-height of 52px when isOpen', () => {
        const props = { isOpen: true };
        expect(getMaxHeight(props)).toBe('52px');
      });
    });
  });

  describe('a11y', () => {
    it('should have role=alert', () =>
      expect(
        shallow(<Banner />)
          .find(Container)
          .is('[role="alert"]'),
      ).toBe(true));

    it('should be aria-hidden=false when isOpen is true', () =>
      expect(
        shallow(<Banner isOpen />)
          .find(Container)
          .is('[aria-hidden=false]'),
      ).toBe(true));

    it('should be aria-hidden=true when isOpen is false', () =>
      expect(
        shallow(<Banner />)
          .find(Container)
          .is('[aria-hidden=true]'),
      ).toBe(true));
  });

  it('should render warning banner correctly', () => {
    const wrapper = (
      <Banner isOpen appearance="warning">
        This is a warning banner with a <a href="http://atlassian.com">link</a>
      </Banner>
    );
    const Component = renderer.create(wrapper).toJSON();
    expect(Component).toMatchSnapshot();
  });

  it('should render error banner correctly', () => {
    const wrapper = (
      <Banner isOpen appearance="error">
        This is an error banner with a <a href="http://atlassian.com">link</a>
      </Banner>
    );
    const Component = renderer.create(wrapper).toJSON();
    expect(Component).toMatchSnapshot();
  });
});
