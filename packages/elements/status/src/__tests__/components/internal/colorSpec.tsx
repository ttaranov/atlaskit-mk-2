import * as React from 'react';
import { mount } from 'enzyme';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Color from '../../../components/internal/color';

describe('Color', () => {
  it('should render color button', () => {
    const component = mount(
      <Color
        value={'red'}
        label={'Red'}
        onClick={jest.fn()}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
      />,
    );

    expect(component.find('button').length).toBe(1);
  });

  it('should render done icon when selected', () => {
    const component = mount(
      <Color
        value={'red'}
        label={'Red'}
        onClick={jest.fn()}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
        isSelected={true}
      />,
    );

    expect(component.find(EditorDoneIcon).length).toBe(1);
  });

  it('should not render done icon when not selected', () => {
    const component = mount(
      <Color
        value={'red'}
        label={'Red'}
        onClick={jest.fn()}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
        isSelected={false}
      />,
    );

    expect(component.find(EditorDoneIcon).length).toBe(0);
  });

  it('should call onClick handler prop on click', () => {
    const onClick = jest.fn();
    const value = 'red';
    const component = mount(
      <Color
        value={value}
        label={'Red'}
        onClick={onClick}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
        isSelected={false}
      />,
    );

    component.find('button').simulate('click');
    expect(onClick).toHaveBeenCalledWith(value);
  });
});
