// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import { RadioGroupWithoutAnalytics as RadioGroup } from '../../RadioGroup';
import { name } from '../../../package.json';
import Radio from '../../RadioBase';
import type { OptionsPropType } from '../../types';

describe(name, () => {
  describe('RadioGroup', () => {
    const sampleItems: OptionsPropType = [
      { name: 'test', value: '1', label: 'one' },
      { name: 'test', value: '2', label: 'two' },
      { name: 'test', value: '3', label: <i>three</i>, isDisabled: true },
    ];

    describe('exports', () => {
      it('the FieldRadioGroup component', () => {
        expect(RadioGroup).not.toBe(undefined);
        expect(
          new RadioGroup({
            selectedValue: null,
            defaultSelectedValue: null,
            options: [],
            onChange: () => {},
          }),
        ).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<RadioGroup options={[]} onChange={() => {}} />);
      });

      it('should be able to create a component', () => {
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should set up the initial state', () => {
        expect(wrapper.state('selectedValue')).toBe(undefined);
      });
    });

    describe('props', () => {
      describe('defaultValue prop', () => {
        it('renders an Radio with correct props for each item in the array', () => {
          const wrapper = mount(<RadioGroup options={sampleItems} />);
          expect(wrapper.find(Radio).length).toBe(sampleItems.length);

          const radios = wrapper.find(Radio);
          for (let i = 0; i < sampleItems.length; i++) {
            const radio = radios.at(i);
            const item = sampleItems[i];
            expect(radio.prop('name')).toBe(item.name);
            expect(radio.prop('value')).toBe(item.value);
            expect(radio.prop('children')).toBe(item.label);
            expect(radio.prop('isDisabled')).toBe(!!item.isDisabled);
            expect(radio.prop('isChecked')).toBe(false);
          }
        });
      });

      describe('items prop with defaultValue', () => {
        const sampleItemsWithDefault: OptionsPropType = sampleItems.map(
          item => ({
            ...item,
          }),
        );

        it('selects the item by default', () => {
          const wrapper = mount(
            <RadioGroup
              defaultSelectedValue={sampleItemsWithDefault[2].value}
              options={sampleItemsWithDefault}
            />,
          );
          expect(
            wrapper
              .find(Radio)
              .at(2)
              .prop('isChecked'),
          ).toBe(true);
        });

        it('is overridden when an item is selected', () => {
          const wrapper = mount(
            <RadioGroup
              defaultSelectedValue={sampleItemsWithDefault[2].value}
              options={sampleItemsWithDefault}
            />,
          );

          const radios = () => wrapper.find(Radio);
          radios()
            .at(0)
            .find('input')
            .simulate('change');

          expect(wrapper.state('selectedValue')).toBe(
            sampleItemsWithDefault[0].value,
          );
          const r = radios();
          expect(r.at(0).prop('isChecked')).toBe(true);
          expect(r.at(1).prop('isChecked')).toBe(false);
          expect(r.at(2).prop('isChecked')).toBe(false);
        });
      });

      describe('onRadio changed prop', () => {
        it('should be called when a value is selected', () => {
          const spy = jest.fn();
          const wrapper = mount(
            <RadioGroup options={sampleItems} onChange={spy} />,
          );
          wrapper
            .find(Radio)
            .first()
            .find('input')
            .simulate('change');
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('updates the selectedValue state when a radio is changed', () => {
          const wrapper = mount(<RadioGroup options={sampleItems} />);
          expect(wrapper.state('selectedValue')).toBe(undefined);
          wrapper
            .find(Radio)
            .first()
            .find('input')
            .simulate('change');
          expect(wrapper.state('selectedValue')).toBe(sampleItems[0].value);
        });
      });
    });
  });
});
