// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';
import Button from '@atlaskit/button';
import PaginationWithAnalytics from '../../..';
import { PaginationWithoutAnalytics as Pagination } from '../../Pagination';
import { Ellipsis } from '../../../styled';

import { name } from '../../../../package.json';

describe(name, () => {
  it('should not render when total is 0', () => {
    const wrapper = mount(<Pagination total={0} value={0} />);
    expect(wrapper.find(Button).length).toBe(0);
  });

  it('should render pages and Prev/Next buttons when total is not 0', () => {
    const wrapper = mount(<Pagination total={2} />);
    const buttons = wrapper.find(Button);
    expect(buttons.length).toBe(4);
    expect(buttons.at(0).prop('ariaLabel')).toBe('Previous');
    expect(buttons.at(1).text()).toBe('1');
    expect(buttons.at(2).text()).toBe('2');
    expect(buttons.at(3).prop('ariaLabel')).toBe('Next');
  });

  it('should render Prev button disabled when current in 1', () => {
    const wrapper = mount(<Pagination total={3} />);
    const prevButton = wrapper.find(Button).at(0);
    expect(prevButton.prop('isDisabled')).toBe(true);
  });

  it('should render Next button disabled when current in 1', () => {
    const wrapper = mount(<Pagination total={3} value={3} />);
    const nextButton = wrapper.find(Button).at(4);
    expect(nextButton.prop('isDisabled')).toBe(true);
  });

  it('should not render ellipsis with seven pages and page 1 selected', () => {
    const wrapper = shallow(<Pagination total={7} />);
    const { length } = wrapper.find(Ellipsis);
    expect(length).toBe(0);
  });

  it('should render one ellipsis with 15 pages and page 1 selected', () => {
    const wrapper = shallow(<Pagination total={15} />);
    const { length } = wrapper.find(Ellipsis);
    expect(length).toBe(1);
  });

  it('should render one ellipsis with 15 pages and page 14 selected', () => {
    const wrapper = shallow(<Pagination total={15} value={14} />);
    const { length } = wrapper.find(Ellipsis);
    expect(length).toBe(1);
  });

  it('should render two ellipsis with 15 pages and page 8 selected', () => {
    const wrapper = shallow(<Pagination total={15} value={8} />);
    const { length } = wrapper.find(Ellipsis);
    expect(length).toBe(2);
  });

  it('should invoke callback passed to onChange', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Pagination total={3} value={2} onChange={onChange} />,
    );
    const buttons = wrapper.find(Button);

    buttons.at(1).simulate('click');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1);

    buttons.at(3).simulate('click');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  describe("shouldn't invoke callback passed to onChange", () => {
    it('when clicked on active page', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Pagination total={3} value={2} onChange={onChange} />,
      );
      const buttons = wrapper.find(Button);
      buttons.at(2).simulate('click');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('when clicked on Prev and first page is active', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Pagination total={3} value={1} onChange={onChange} />,
      );
      const buttons = wrapper.find(Button);
      buttons.at(1).simulate('click');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('when clicked on Next and last page is active', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Pagination total={3} value={3} onChange={onChange} />,
      );
      const buttons = wrapper.find(Button);
      buttons.at(4).simulate('click');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('should change current page', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(<Pagination total={10} defaultValue={3} />);
    });

    it('upon clicking on corresponding button', () => {
      let buttons = wrapper.find(Button);
      buttons.at(2).simulate('click');
      expect(wrapper.state('current')).toBe(2);
      buttons = wrapper.find(Button);
      expect(buttons.at(2).prop('isSelected')).toBe(true);
      expect(buttons.at(3).prop('isSelected')).toBe(false);
    });

    it('upon clicking on Prev button', () => {
      let buttons = wrapper.find(Button);
      buttons.at(0).simulate('click');
      expect(wrapper.state('current')).toBe(2);
      buttons = wrapper.find(Button);
      expect(buttons.at(2).prop('isSelected')).toBe(true);
      expect(buttons.at(3).prop('isSelected')).toBe(false);
    });

    it('upon clicking on Next button', () => {
      let buttons = wrapper.find(Button);
      buttons.at(7).simulate('click');
      expect(wrapper.state('current')).toBe(4);
      buttons = wrapper.find(Button);
      expect(buttons.at(4).prop('isSelected')).toBe(true);
      expect(buttons.at(3).prop('isSelected')).toBe(false);
    });
  });
  it('should change current page when defaultCurrent is changed', () => {
    class Consumer extends React.Component<{}, { page: number }> {
      state = { page: 5 };
      render() {
        return <Pagination defaultValue={this.state.page} total={10} />;
      }
    }
    const wrapper = mount(<Consumer />);
    wrapper.setState({ page: 6 });
    const Buttons = wrapper.find(Button);
    const selectedButton = Buttons.filterWhere(button =>
      button.prop('isSelected'),
    );
    expect(selectedButton.text()).toBe('6');
  });
});

describe('PaginationWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<PaginationWithAnalytics total={0} value={0} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
