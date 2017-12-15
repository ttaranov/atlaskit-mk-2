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
            text: 'Like',
            handler: jest.fn(),
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
            text: 'Like',
            handler: jest.fn(),
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
            text: 'Like',
            handler: jest.fn(),
          },
          {
            text: 'Comment',
            handler: jest.fn(),
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
            text: 'Like',
            handler: jest.fn(),
          },
          {
            text: 'Comment',
            handler: jest.fn(),
          },
          {
            text: 'Report',
            handler: jest.fn(),
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

  it('should call the handler for the first action when it is a button', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            text: 'Like',
            handler: handler1,
          },
          {
            text: 'Comment',
            handler: handler2,
          },
        ]}
      />,
    );

    element
      .find(Button)
      .first()
      .simulate('click');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(0);
  });

  it('should call the handler for the first action when it is a drop down item', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const element = shallow(
      <Actions
        compact={true}
        actions={[
          {
            text: 'Like',
            handler: handler1,
          },
          {
            text: 'Comment',
            handler: handler2,
          },
        ]}
      />,
    );

    element
      .find(DropdownItem)
      .first()
      .simulate('click');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(0);
  });

  it('should call the handler for the second action when it is a button', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            text: 'Like',
            handler: handler1,
          },
          {
            text: 'Comment',
            handler: handler2,
          },
        ]}
      />,
    );

    element
      .find(Button)
      .at(1)
      .simulate('click');
    expect(handler1).toHaveBeenCalledTimes(0);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should call the handler for the second action when it is a drop down item', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();
    const element = shallow(
      <Actions
        compact={false}
        actions={[
          {
            text: 'Like',
            handler: handler1,
          },
          {
            text: 'Comment',
            handler: handler2,
          },
          {
            text: 'Report',
            handler: handler3,
          },
        ]}
      />,
    );

    element
      .find(DropdownItem)
      .first()
      .simulate('click');
    expect(handler1).toHaveBeenCalledTimes(0);
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler3).toHaveBeenCalledTimes(0);
  });
});
