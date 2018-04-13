// @flow

import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(
      <Tooltip>
        <div>foo</div>
      </Tooltip>,
    );
    expect(wrapper).not.toBe(undefined);
  });

  it('should update correct state when show is called with immediate true', () => {
    const wrapper = shallow(
      <Tooltip>
        <div>foo</div>
      </Tooltip>,
    ).dive();

    const instance = wrapper.instance();

    expect(wrapper.state()).toEqual(
      expect.objectContaining({
        isVisible: false,
        coordinates: null,
      }),
    );

    instance.show({ immediate: true });

    expect(wrapper.state()).toEqual(
      expect.objectContaining({
        immediatelyShow: true,
        isVisible: true,
        coordinates: null,
      }),
    );
  });

  it('should update correct state when show is called with immediate false', () => {
    const wrapper = shallow(
      <Tooltip>
        <div>foo</div>
      </Tooltip>,
    ).dive();

    const instance = wrapper.instance();

    expect(wrapper.state()).toEqual(
      expect.objectContaining({
        isVisible: false,
        coordinates: null,
      }),
    );

    instance.show({ immediate: false });

    expect(wrapper.state()).toEqual(
      expect.objectContaining({
        immediatelyShow: false,
        isVisible: true,
        coordinates: null,
      }),
    );
  });
});
