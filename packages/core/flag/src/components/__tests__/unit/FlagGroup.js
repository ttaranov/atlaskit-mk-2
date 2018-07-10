// @flow

import React from 'react';
import { mount } from 'enzyme';
import LayerManager from '@atlaskit/layer-manager';
import Flag from '../../..';
import Container, { DismissButton } from '../../Flag/styledFlag';
import FlagGroup from '../../FlagGroup';

describe('FlagGroup', () => {
  const generateFlag = extraProps => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );

  it('should render the correct number of Flag children', () => {
    const wrapper = mount(
      <LayerManager>
        <FlagGroup>
          {generateFlag()}
          {generateFlag()}
          {generateFlag()}
        </FlagGroup>
      </LayerManager>,
    );
    expect(wrapper.find(Container).length).toBe(3);
  });

  it('onDismissed should be called when child Flag is dismissed', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <LayerManager>
        <FlagGroup onDismissed={spy}>
          {generateFlag({
            id: 'a',
            isDismissAllowed: true,
            onDismissed: spy,
          })}
          {generateFlag({ id: 'b' })}
        </FlagGroup>
      </LayerManager>,
    );
    wrapper.find(DismissButton).simulate('click');
    wrapper
      .find(Container)
      .first()
      .simulate('animationEnd');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });
});
