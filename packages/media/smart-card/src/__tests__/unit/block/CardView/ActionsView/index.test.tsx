import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import ActionsView from '../../../../../block/CardView/ActionsView';

const likeAction = {
  text: 'Like',
  handler: jest.fn(),
};

const commentAction = {
  text: 'Comment',
  handler: jest.fn(),
};

const reportAction = {
  text: 'Report',
  handler: jest.fn(),
};

describe('ActionsView', () => {
  beforeEach(() => {
    likeAction.handler.mockReset();
    commentAction.handler.mockReset();
    reportAction.handler.mockReset();
  });

  it('should render zero actions as null', () => {
    const element = shallow(<ActionsView actions={[]} />);
    expect(element.getElement()).toBeNull();
  });

  it('should render a single action as a single button', () => {
    const element = shallow(<ActionsView actions={[likeAction]} />);

    const buttons = element.find(Button);

    expect(buttons).toHaveLength(1);
    expect(element.find(DropdownItem)).toHaveLength(0);

    expect(buttons.render().text()).toEqual('Like');
  });

  it('should render two actions as two buttons', () => {
    const element = shallow(
      <ActionsView actions={[likeAction, commentAction]} />,
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

  it('should render three actions as one button and a drop down menu', () => {
    const element = shallow(
      <ActionsView actions={[likeAction, commentAction, reportAction]} />,
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

  it('should call onAction with the first action when it is a button', () => {
    const onAction = jest.fn();
    const element = shallow(
      <ActionsView actions={[likeAction, commentAction]} onAction={onAction} />,
    );

    element
      .find(Button)
      .first()
      .simulate('click');
    expect(onAction).toBeCalledWith(likeAction);
  });

  it('should call onAction with the second action when it is a button', () => {
    const onAction = jest.fn();
    const element = shallow(
      <ActionsView actions={[likeAction, commentAction]} onAction={onAction} />,
    );

    element
      .find(Button)
      .at(1)
      .simulate('click');
    expect(onAction).toBeCalledWith(commentAction);
  });

  it('should call onAction with the second action when it is a drop down item', () => {
    const onAction = jest.fn();
    const element = shallow(
      <ActionsView
        actions={[likeAction, commentAction, reportAction]}
        onAction={onAction}
      />,
    );

    element
      .find(DropdownItem)
      .first()
      .simulate('click');
    expect(onAction).toBeCalledWith(commentAction);
  });
});
