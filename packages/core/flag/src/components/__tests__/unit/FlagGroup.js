// @flow

import React from 'react';
import { mount } from 'enzyme';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme';
import Flag from '../../..';
import Container, { DismissButton } from '../../Flag/styledFlag';
import FlagGroup from '../../FlagGroup';

describe('FlagGroup', () => {
  const generateFlag = extraProps => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );

  it('should render the correct number of Flag children', () => {
    const wrapper = mount(
      <FlagGroup>
        {generateFlag()}
        {generateFlag()}
        {generateFlag()}
      </FlagGroup>,
    );
    expect(wrapper.find(Container).length).toBe(3);
  });

  it('onDismissed should be called when child Flag is dismissed', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <FlagGroup onDismissed={spy}>
        {generateFlag({
          id: 'a',
          isDismissAllowed: true,
          onDismissed: spy,
        })}
        {generateFlag({ id: 'b' })}
      </FlagGroup>,
    );
    wrapper.find(DismissButton).simulate('click');
    wrapper
      .find(Container)
      .first()
      .simulate('animationEnd');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', expect.anything());
  });
  it('should render flagGroup in portal', () => {
    const wrapper = mount(<FlagGroup>{generateFlag()}</FlagGroup>);
    expect(wrapper.find(Portal).props().zIndex).toBe(layers.flag());
  });
});
