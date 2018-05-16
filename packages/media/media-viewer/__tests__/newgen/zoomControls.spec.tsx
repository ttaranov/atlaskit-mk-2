import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import { ZoomControls, ZoomControlsProps } from '../../src/newgen/zoomControls';

describe('<ZoomControls />', () => {
  const setup = (props?: Partial<ZoomControlsProps>) => {
    const onChange = jest.fn();
    const component = shallow(
      <ZoomControls zoomLevel={1} onChange={onChange} {...props} />,
    );

    return {
      onChange,
      component,
    };
  };

  it('should increase and decrease zoom linearly', () => {
    const { component, onChange } = setup();

    component
      .find(Button)
      .first()
      .simulate('click');
    expect(onChange).lastCalledWith(0.8);
    component
      .find(Button)
      .first()
      .simulate('click');
    expect(onChange).lastCalledWith(0.64);
    component
      .find(Button)
      .last()
      .simulate('click');
    component
      .find(Button)
      .last()
      .simulate('click');
    component
      .find(Button)
      .last()
      .simulate('click');
    expect(onChange).lastCalledWith(1.1);
  });

  it('should allow zooming with constrains', () => {
    const { component, onChange } = setup({ step: 0.5 });

    component
      .find(Button)
      .first()
      .simulate('click');
    component
      .find(Button)
      .first()
      .simulate('click');
    expect(onChange).lastCalledWith(0.25);
    component
      .find(Button)
      .first()
      .simulate('click');
    expect(onChange).lastCalledWith(0.2);
  });
});
