//@flow
import React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import Checkbox from '@atlaskit/checkbox';
import Followup, { RoleDropdown } from '../Followup';
import { Header, Description } from '../common';
import { RoleQuestion } from '../styled/followup';

describe('Followup page', () => {
  describe('Component', () => {
    const getDefaultProps = () => ({
      messages: {
        title: 'a',
        description: 'b',
        optOut: 'c',
        roleQuestion: 'd',
        contactQuestion: 'e',
        send: 'f',
        rolePlaceholder: 'g',
      },
      canClose: true,
      canOptOut: true,
      onClose: jest.fn(),
      onOptOut: jest.fn(),
      roles: ['h', 'i', 'j'],
      onRoleSelect: jest.fn(),
      onCanContactChange: jest.fn(),
      onSubmit: jest.fn(),
    });

    it('should render a header', () => {
      const wrapper = shallow(<Followup {...getDefaultProps()} />);
      expect(wrapper.find(Header).exists()).toBe(true);
    });

    it('should render a description', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Followup {...props} />);
      const desc = wrapper.find(Description);
      expect(desc.exists()).toBe(true);
      expect(
        desc
          .children()
          .first()
          .text(),
      ).toEqual(props.messages.description);
    });

    it('should render a RoleQuestion', () => {
      const wrapper = shallow(<Followup {...getDefaultProps()} />);
      expect(wrapper.find(RoleQuestion).exists()).toBe(true);
    });

    it('should render a RoleDropdown', () => {
      const wrapper = shallow(<Followup {...getDefaultProps()} />);
      expect(wrapper.find(RoleDropdown).exists()).toBe(true);
    });

    it('should render a Checkbox', () => {
      const wrapper = shallow(<Followup {...getDefaultProps()} />);
      expect(wrapper.find(Checkbox).exists()).toBe(true);
    });

    it('should render a Button', () => {
      const wrapper = shallow(<Followup {...getDefaultProps()} />);
      expect(wrapper.find(Button).exists()).toBe(true);
    });

    describe('onRoleSelect', () => {
      it('should call onRoleSelect prop', () => {
        const props = getDefaultProps();
        const wrapper = shallow(<Followup {...props} />);
        const instance = wrapper.instance();

        instance.onRoleSelect('a');
        expect(props.onRoleSelect).toHaveBeenCalledWith('a');
      });
    });

    describe('onCanContactChange', () => {
      it('should call onCanContactChange prop', () => {
        const props = getDefaultProps();
        const wrapper = shallow(<Followup {...props} />);
        const instance = wrapper.instance();

        instance.onCanContactChange({ isChecked: true });
        expect(props.onCanContactChange).toHaveBeenCalledWith(true);
      });
    });

    describe('onSubmit', () => {
      it('should call onSubmit prop', () => {
        const props = getDefaultProps();
        const wrapper = shallow(<Followup {...props} />);
        const instance = wrapper.instance();

        instance.onSubmit({ role: 'a', canContact: true });
        expect(props.onSubmit).toHaveBeenCalledWith({
          role: null,
          canContact: false,
        });
      });
    });
  });

  describe('RoleDropdown', () => {
    const getDefaultProps = () => ({
      roles: ['a', 'b', 'c'],
      placeholder: 'd',
      selected: null,
      onRoleSelect: jest.fn(),
    });

    it('should render a DropdownMenu', () => {
      const wrapper = shallow(<RoleDropdown {...getDefaultProps()} />);
      expect(wrapper.find(DropdownMenu).exists()).toBe(true);
    });

    it('should should render the placeholder trigger if no item is selected', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<RoleDropdown {...props} />);
      expect(wrapper.find(DropdownMenu).prop('trigger')).toEqual(
        props.placeholder,
      );
    });

    it('should should render the selected item as  trigger an item is selected', () => {
      const props = {
        ...getDefaultProps(),
        selected: 'a',
      };
      const wrapper = shallow(<RoleDropdown {...props} />);
      expect(wrapper.find(DropdownMenu).prop('trigger')).toEqual('a');
    });

    it('should should render 3 dropdown items when clicked', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<RoleDropdown {...props} />);
      expect(
        wrapper
          .find(DropdownMenu)
          .find(DropdownItem)
          .getElements().length,
      ).toEqual(3);
    });

    it('should call onRoleSelect callback when dropdown item clicked', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<RoleDropdown {...props} />);
      wrapper
        .find(DropdownMenu)
        .find(DropdownItem)
        .first()
        .simulate('click');
      expect(props.onRoleSelect).toHaveBeenCalledWith('a');
    });
  });
});
