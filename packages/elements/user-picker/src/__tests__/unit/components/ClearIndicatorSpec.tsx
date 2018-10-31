import { components } from '@atlaskit/select';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ClearIndicator } from '../../../components/ClearIndicator';

describe('ClearIndicator', () => {
  const shallowClearIndicator = props => shallow(<ClearIndicator {...props} />);

  it('should call onClearIndicatorHover onMouseEnter', () => {
    const onClearIndicatorHover = jest.fn();
    const component = shallowClearIndicator({
      selectProps: { onClearIndicatorHover },
    });

    component.simulate('mouseEnter');

    expect(onClearIndicatorHover).toHaveBeenCalledWith(true);
  });

  it('should call onClearIndicatorHover onMouseLeave', () => {
    const onClearIndicatorHover = jest.fn();
    const component = shallowClearIndicator({
      selectProps: { onClearIndicatorHover },
    });

    component.simulate('mouseLeave');

    expect(onClearIndicatorHover).toHaveBeenCalledWith(false);
  });

  it('should call onClearIndicator on unmount', () => {
    const onClearIndicatorHover = jest.fn();
    const component = shallowClearIndicator({
      selectProps: { onClearIndicatorHover },
    });

    component.unmount();
    expect(onClearIndicatorHover).toHaveBeenCalledWith(false);
  });

  it('should clear value onMouseDown', () => {
    const clearValue = jest.fn();
    const component = shallowClearIndicator({ clearValue });

    const { onMouseDown } = component
      .find(components.ClearIndicator)
      .prop('innerProps');

    const stopPropagation = jest.fn();
    onMouseDown({ stopPropagation });

    expect(clearValue).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });
});
