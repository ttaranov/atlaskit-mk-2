import * as React from 'react';
import { shallow } from 'enzyme';
import ColorPalette from '../../../components/internal/color-palette';
import Color from '../../../components/internal/color';

describe('ColorPalette', () => {
  it('should render 6 colors', () => {
    const onClick = jest.fn();
    const component = shallow(
      <ColorPalette onClick={onClick} selectedColor={'red'} />,
    );

    expect(component.find(Color).length).toBe(6);
    expect(
      component
        .find(Color)
        .first()
        .props().onClick,
    ).toBe(onClick);
  });

  it('should select selected color', () => {
    const component = shallow(
      <ColorPalette onClick={jest.fn()} selectedColor={'red'} />,
    );

    expect(
      component.findWhere(n => n.is(Color) && n.prop('isSelected')).length,
    ).toBe(1);
  });

  it('should not select if no selected color', () => {
    const component = shallow(<ColorPalette onClick={jest.fn()} />);

    expect(
      component.findWhere(n => n.is(Color) && n.prop('isSelected')).length,
    ).toBe(0);
  });
});
