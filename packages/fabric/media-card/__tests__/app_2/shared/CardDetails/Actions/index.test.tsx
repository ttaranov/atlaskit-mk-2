import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import Actions from '../../../../../src/app_2/shared/CardDetails/Actions';

describe('Actions', () => {
  it('should render zero actions as null', () => {
    const element = shallow(<Actions actions={[]} />);
    expect(element.getNode()).toBeNull();
  });

  it('should render a single action as a drop down menu when compact=true', () => {
    const element = shallow(
      <Actions
        compact={true}
        actions={[
          {
            title: 'Like',
            target: null,
          },
        ]}
      />,
    );

    expect(element.find(Button)).toHaveLength(0);
    expect(element.find(DropdownItem)).toHaveLength(1);
  });

  it('should render a single action as a single button when compact=false', () => {
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            title: 'Like',
            target: null,
          },
        ]}
      />,
    );

    const buttons = element.find(Button);

    expect(buttons).toHaveLength(1);
    expect(element.find(DropdownItem)).toHaveLength(0);

    expect(buttons.render().text()).toEqual('Like');
  });

  it('should render two actions as two buttons when compact=false', () => {
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            title: 'Like',
            target: null,
          },
          {
            title: 'Comment',
            target: null,
          },
        ]}
      />,
    );

    const buttons = element.find(Button);

    expect(buttons).toHaveLength(2);
    expect(element.find(DropdownItem)).toHaveLength(0);

    expect(
      buttons
        .first()
        .render()
        .text(),
    ).toEqual('Like');
    expect(
      buttons
        .last()
        .render()
        .text(),
    ).toEqual('Comment');
  });

  it('should render three actions as one button and a drop down menu when compact=false', () => {
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            title: 'Like',
            target: null,
          },
          {
            title: 'Comment',
            target: null,
          },
          {
            title: 'Report',
            target: null,
          },
        ]}
      />,
    );

    const buttons = element.find(Button);
    const dropdowns = element.find(DropdownItem);

    expect(buttons).toHaveLength(1);
    expect(dropdowns).toHaveLength(2);

    expect(
      buttons
        .first()
        .render()
        .text(),
    ).toEqual('Like');
    expect(
      dropdowns
        .first()
        .render()
        .text(),
    ).toEqual('Comment');
    expect(
      dropdowns
        .last()
        .render()
        .text(),
    ).toEqual('Report');
  });

  it('should call onAction with the data from the first action when it is a button', () => {
    const onAction = jest.fn();
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            title: 'Like',
            target: 111,
          },
          {
            title: 'Comment',
            target: 222,
          },
        ]}
        onAction={onAction}
      />,
    );

    element
      .find(Button)
      .first()
      .simulate('click');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(111);
  });

  it('should call onAction with the data from the first action when it is a drop down item', () => {
    const onAction = jest.fn();
    const element = shallow(
      <Actions
        compact={true}
        actions={[
          {
            title: 'Like',
            target: 111,
          },
          {
            title: 'Comment',
            target: 222,
          },
        ]}
        onAction={onAction}
      />,
    );

    element
      .find(DropdownItem)
      .first()
      .simulate('click');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(111);
  });

  it('should call onAction with the data from the second action when it is a button', () => {
    const onAction = jest.fn();
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            title: 'Like',
            target: 111,
          },
          {
            title: 'Comment',
            target: 222,
          },
        ]}
        onAction={onAction}
      />,
    );

    element
      .find(Button)
      .at(1)
      .simulate('click');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(222);
  });

  it('should call onAction with the data from the second action when it is a drop down item', () => {
    const onAction = jest.fn();
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            title: 'Like',
            target: 111,
          },
          {
            title: 'Comment',
            target: 222,
          },
          {
            title: 'Report',
            target: 333,
          },
        ]}
        onAction={onAction}
      />,
    );

    element
      .find(DropdownItem)
      .first()
      .simulate('click');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(222);
  });
});
