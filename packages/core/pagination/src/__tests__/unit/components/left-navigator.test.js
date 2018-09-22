//@flow
import React from 'react';
import { mount } from 'enzyme';
import { name } from '../../../../package.json';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import Button from '@atlaskit/button';

import LeftNavigation from '../../../components/navigators/LeftNavigator';

describe(`${name} - left navigator`, () => {
  it('should render left chevron if children are not passed', () => {
    const wrapper = mount(<LeftNavigation />);
    expect(wrapper.find(ChevronLeftLargeIcon).length).toBe(1);
    expect(wrapper.text()).toBe('');
  });
  it('should render the node passed as child instead of left chevron', () => {
    const wrapper = mount(
      <LeftNavigation>
        <div>$</div>
      </LeftNavigation>,
    );
    expect(wrapper.find(ChevronLeftLargeIcon).length).toBe(0);
    expect(wrapper.text()).toBe('$');
  });
  it('should pass in label as ariaLabel to button', () => {
    const wrapper = mount(<LeftNavigation label="pehla" />);
    expect(wrapper.find(Button).prop('ariaLabel')).toBe('pehla');
  });
  //it('should should pass in the isDisabled prop to ');
});
