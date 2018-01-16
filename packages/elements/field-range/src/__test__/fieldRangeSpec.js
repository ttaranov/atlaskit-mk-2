/* eslint-disable no-undef, import/no-extraneous-dependencies */
// @flow
import React from 'react';
import { mount } from 'enzyme';
import FieldRange from '../FieldRange';

// We need to simulate a real event on the DOM element due IE compatibility
const simulateValueChange = (range, value) => {
  const input = range.find('input');
  const inputElement: ?HTMLInputElement = (input
    .find('input')
    .getDOMNode(): any);
  if (inputElement) {
    inputElement.value = `${value}`;
    inputElement.dispatchEvent(new Event('input', { detail: { value } }));
    range.update();
  }
};

describe('FieldRange', () => {
  describe('with default props', () => {
    let fieldRange;

    beforeEach(() => {
      fieldRange = mount(<FieldRange value={20.12} />);
    });

    it('should have input with type "range"', () => {
      const input = fieldRange.find('input');
      expect(input.props().type).toBe('range');
    });

    it('should have min, max and step set to default values', () => {
      const input = fieldRange.find('input');
      expect(input.props().min).toBe(0);
      expect(input.props().max).toBe(100);
      expect(input.props().step).toBe(0.1);
    });

    it('should input with defined value', () => {
      const input = fieldRange.find('input');
      expect(input.props().value).toBe('20.12');
    });
  });

  describe('with defined props', () => {
    let fieldRange;
    let onChangeSpy;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      fieldRange = mount(
        <FieldRange value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
    });

    it('should have defined min and max values', () => {
      const input = fieldRange.find('input');
      expect(input.props().min).toBe(10);
      expect(input.props().max).toBe(20);
    });

    it('should call spy when value is changed', () => {
      simulateValueChange(fieldRange, 15);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(15);
    });

    it('should change input value when value is changed', () => {
      simulateValueChange(fieldRange, 15);
      const input = fieldRange.find('input');
      expect(input.props().value).toBe('15');
    });

    it('should change input value when prop is changed', () => {
      fieldRange.setProps({ value: 15 });
      const input = fieldRange.find('input');
      expect(input.props().value).toBe('15');
    });
  });
});
