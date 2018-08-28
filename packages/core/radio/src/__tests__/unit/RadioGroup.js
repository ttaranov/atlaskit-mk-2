// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import Radio from '../../RadioBase';
import RadioGroupWithAnalytics, {
  RadioGroupWithoutAnalytics as RadioGroup,
} from '../../RadioGroup';
import { name } from '../../../package.json';
import type { OptionPropType } from '../../types';

describe(name, () => {
  describe('RadioGroup', () => {
    const sampleOptions = [
      { name: 'test', value: '1', label: 'one' },
      { name: 'test', value: '2', label: 'two' },
      { name: 'test', value: '3', label: <i>three</i>, isDisabled: true },
    ];

    describe('exports', () => {
      it('the RadioGroup component', () => {
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
      it('should be able to create a component', () => {
        const wrapper = shallow(<RadioGroup onChange={() => {}} />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a Radio for each option', () => {
        const wrapper = mount(
          <RadioGroup onChange={() => {}} options={sampleOptions} />,
        );
        expect(wrapper.find(Radio).length).toBe(3);
      });
    });

    describe('props', () => {
      describe('options prop', () => {
        it('renders a Radio with correct props for each option in the array', () => {
          const wrapper = mount(
            <RadioGroup onChange={() => {}} options={sampleOptions} />,
          );
          expect(wrapper.find(Radio).length).toBe(sampleOptions.length);

          const radios = wrapper.find(Radio);
          for (let i = 0; i < sampleOptions.length; i++) {
            const radio = radios.at(i);
            const option: OptionPropType = sampleOptions[i];
            expect(radio.prop('name')).toBe(option.name);
            expect(radio.prop('value')).toBe(option.value);
            expect(radio.prop('children')).toBe(option.label);
            expect(radio.prop('isDisabled')).toBe(!!option.isDisabled);
            expect(radio.prop('isChecked')).toBe(!!option.isChecked);
          }
        });
      });

      describe('isRequired prop', () => {
        it('is reflected to each Radio option', () => {
          const isRequired = true;
          const wrapper = shallow(
            <RadioGroup onChange={() => {}} isRequired={isRequired} />,
          );
          wrapper
            .find(Radio)
            .forEach(radio =>
              expect(radio.prop('isRequired', isRequired)).not.toBe(undefined),
            );
        });
      });

      describe('selectedValue prop', () => {
        it('sets the corresponding Radio instance isChecked prop to true', () => {
          const wrapper = mount(
            <RadioGroup
              selectedValue={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );
          const radio = () => wrapper.find(Radio);

          const rUncontrolled = radio();
          expect(rUncontrolled.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolled.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolled.at(2).prop('isChecked')).toBe(false);
        });
        it('Ignores internal state values, if a selectedValue prop is specified', () => {
          const wrapper = mount(
            <RadioGroup
              selectedValue={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );

          const radio = () => wrapper.find(Radio);
          const rUncontrolled = radio();
          expect(rUncontrolled.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolled.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolled.at(2).prop('isChecked')).toBe(false);

          radio()
            .at(2)
            .find('input')
            .simulate('change');
          expect(wrapper.state('selectedValue')).toBe(sampleOptions[2].value);

          const rUncontrolledClicked = radio();
          expect(rUncontrolledClicked.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolledClicked.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolledClicked.at(2).prop('isChecked')).toBe(false);
        });
        it('If set to undefined, it will revert to the value set in state', () => {
          const wrapper = mount(
            <RadioGroup
              selectedValue={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );
          const radio = () => wrapper.find(Radio);

          const rUncontrolled = radio();
          expect(rUncontrolled.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolled.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolled.at(2).prop('isChecked')).toBe(false);

          radio()
            .at(1)
            .find('input')
            .simulate('change');

          const rUncontrolledClicked = radio();
          expect(rUncontrolledClicked.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolledClicked.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolledClicked.at(2).prop('isChecked')).toBe(false);

          wrapper.setProps({ selectedValue: undefined });
          const rControlled = radio();
          expect(rControlled.at(0).prop('isChecked')).toBe(false);
          expect(rControlled.at(1).prop('isChecked')).toBe(true);
          expect(rControlled.at(2).prop('isChecked')).toBe(false);
        });
      });

      describe('defaultSelectedValue prop', () => {
        it('initially sets the corresponding Radio instance isChecked prop to true', () => {
          const wrapper = mount(
            <RadioGroup
              defaultSelectedValue={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );

          const radio = () => wrapper.find(Radio);
          const r = radio();

          expect(r.at(0).prop('isChecked')).toBe(true);
          expect(r.at(1).prop('isChecked')).toBe(false);
          expect(r.at(2).prop('isChecked')).toBe(false);
        });
        it('overrides the checked Radio instance once a subsequent Radio has been triggered', () => {
          const wrapper = mount(
            <RadioGroup
              defaultSelectedValue={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );
          const radio = () => wrapper.find(Radio);
          const rNeutral = radio();

          expect(rNeutral.at(0).prop('isChecked')).toBe(true);
          expect(rNeutral.at(1).prop('isChecked')).toBe(false);
          expect(rNeutral.at(2).prop('isChecked')).toBe(false);

          radio()
            .at(2)
            .find('input')
            .simulate('change');

          expect(wrapper.state('selectedValue')).toBe(sampleOptions[2].value);
          const rNew = radio();
          expect(rNew.at(0).prop('isChecked')).toBe(false);
          expect(rNew.at(1).prop('isChecked')).toBe(false);
          expect(rNew.at(2).prop('isChecked')).toBe(true);
        });
      });

      describe('onChange prop', () => {
        it('is called when a radio option is changed', () => {
          const spy = jest.fn();
          const wrapper = mount(
            <RadioGroup onChange={spy} options={sampleOptions} />,
          );
          wrapper
            .find(Radio)
            .first()
            .find('input')
            .simulate('change');
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('selection', () => {
      function expectRadioSelected(wrapper, index) {
        const radios = wrapper.find(Radio);
        for (let i = 0; i < radios.length; i++) {
          expect(radios.at(i).prop('isSelected')).toBe(index === i);
        }
      }

      function expectNoRadioSelected(wrapper) {
        return expectRadioSelected(wrapper, -1);
      }

      it('selects the radio with a value corresponding to the specified selectedValue prop', () => {
        const options = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2' },
        ];
        const wrapper = shallow(
          <RadioGroup
            options={options}
            onChange={() => {}}
            selectedValue={options[2].value}
          />,
        );
        expectRadioSelected(wrapper, 2);
      });
      it('does not select an option if not specified', () => {
        const options = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2' },
        ];
        const wrapper = shallow(
          <RadioGroup onChange={() => {}} options={options} />,
        );
        expectNoRadioSelected(wrapper);
      });
      it('can select a radio which is disabled', () => {
        const options = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2', isDisabled: true },
        ];
        const wrapper = shallow(
          <RadioGroup
            options={options}
            onChange={() => {}}
            selectedValue={options[2].value}
          />,
        );
        expectRadioSelected(wrapper, 2);
      });
    });
  });
});

describe('RadioGroupWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<RadioGroupWithAnalytics onChange={() => {}} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
