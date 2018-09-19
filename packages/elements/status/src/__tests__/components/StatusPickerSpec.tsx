import * as React from 'react';
import { shallow } from 'enzyme';
import { StatusPicker } from '../../';
import { FieldTextStateless } from '@atlaskit/field-text';
import ColorPalette from '../../components/internal/color-palette';

describe('StatusPicker', () => {
  it('should render color palette', () => {
    const onColorClick = () => {};
    const component = shallow(
      <StatusPicker
        selectedColor="red"
        text=""
        onColorClick={onColorClick}
        onTextChanged={() => {}}
      />,
    );

    expect(component.find(ColorPalette).length).toBe(1);
    expect(component.find(ColorPalette).prop('selectedColor')).toBe('red');
    expect(component.find(ColorPalette).prop('onClick')).toBe(onColorClick);
  });

  it('should render field text', () => {
    const component = shallow(
      <StatusPicker
        selectedColor="red"
        text="In progress"
        onColorClick={() => {}}
        onTextChanged={() => {}}
      />,
    );

    expect(component.find(FieldTextStateless).length).toBe(1);
    expect(component.find(FieldTextStateless).prop('value')).toBe(
      'In progress',
    );
    expect(component.find(FieldTextStateless).prop('autoFocus')).toBe(true);
  });

  it('should pass onColorClick handler prop to color palette', () => {
    const onColorClick = () => {};
    const component = shallow(
      <StatusPicker
        selectedColor="red"
        text=""
        onColorClick={onColorClick}
        onTextChanged={() => {}}
      />,
    );

    expect(component.find(ColorPalette).prop('onClick')).toBe(onColorClick);
  });

  it('should call onTextChanged on text field change', () => {
    const onTextChanged = jest.fn();
    const component = shallow(
      <StatusPicker
        selectedColor="red"
        text=""
        onColorClick={() => {}}
        onTextChanged={onTextChanged}
      />,
    );

    component
      .find(FieldTextStateless)
      .simulate('change', { target: { value: 'Done' } });
    expect(onTextChanged).toHaveBeenCalledWith('Done');
  });
});
