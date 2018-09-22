//@flow
import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';

import { name } from '../../../../../package.json';
import Navigator from '../../../../components/navigators/navigator';
import {
  LeftNavigator,
  RightNavigator,
} from '../../../../components/navigators';

describe(`${name} navigators`, () => {
  describe(`LeftNavigator`, () => {
    it('default props', () => {
      const wrapper = mount(<LeftNavigator />);
      expect(wrapper.find(Button).prop('ariaLabel')).toBe('previous');
      expect(wrapper.find(Button).prop('isDisabled')).toBe(false);
      /** renders left chevron */
      expect(wrapper.find(ChevronLeftLargeIcon).length).toBe(1);
    });
    it('should passes down label as ariaLabel to button', () => {
      const wrapper = mount(<LeftNavigator label="label" />);
      expect(wrapper.find(Button).prop('ariaLabel')).toBe('label');
    });
    it('should passes down isDisabled prop to button', () => {
      const wrapper = mount(<LeftNavigator isDisabled />);
      expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
    });
    it('should passes down children prop to button', () => {
      const wrapper = mount(<LeftNavigator>$</LeftNavigator>);
      expect(wrapper.find(Button).prop('children')).toBe('$');
    });
  });

  describe(`RightNavigator`, () => {
    it('default props', () => {
      const wrapper = mount(<RightNavigator />);
      expect(wrapper.find(Button).prop('ariaLabel')).toBe('next');
      expect(wrapper.find(Button).prop('isDisabled')).toBe(false);
      /** renders right chevron */
      expect(wrapper.find(ChevronRightLargeIcon).length).toBe(1);
    });
    it('should passes down label as ariaLabel to button', () => {
      const wrapper = mount(<RightNavigator label="label" />);
      expect(wrapper.find(Button).prop('ariaLabel')).toBe('label');
    });
    it('should passes down isDisabled prop to button', () => {
      const wrapper = mount(<RightNavigator isDisabled />);
      expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
    });
    it('should passes down children prop to button', () => {
      const wrapper = mount(<RightNavigator>$</RightNavigator>);
      expect(wrapper.find(Button).prop('children')).toBe('$');
    });
  });
});
