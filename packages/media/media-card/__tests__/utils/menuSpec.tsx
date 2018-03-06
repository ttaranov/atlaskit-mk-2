import * as React from 'react';
import { mount } from 'enzyme';
import DropdownMenu from '@atlaskit/dropdown-menu';

import { Menu } from '../../src/utils/menu/index';
import { MeatBallsWrapper, DeleteBtn } from '../../src/utils/menu/styled';
import { CardActionType } from '../../src/actions';

describe('Menu', () => {
  const menuActions = [
    { label: 'Open', handler: () => {} },
    { label: 'Close', handler: () => {} },
  ];
  const deleteAction = {
    type: CardActionType.delete,
    label: 'Delete',
    handler: () => {},
  };
  const animStub = window.cancelAnimationFrame;
  // Stub window.cancelAnimationFrame, so Popper (used in Layer) doesn't error when accessing it.
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  it('should render the meatballs menu when supplied with multiple actions', () => {
    const card = mount(<Menu actions={menuActions} />);
    expect(card.find(MeatBallsWrapper)).toHaveLength(1);
    expect(card.find(DeleteBtn)).toHaveLength(0);
  });

  it('should render the meatballs menu when supplied with multiple actions including one with type "delete"', () => {
    const card = mount(<Menu actions={[deleteAction]} />);
    expect(card.find(MeatBallsWrapper)).toHaveLength(0);
    expect(card.find(DeleteBtn)).toHaveLength(1);
  });

  it('should render the delete button when supplied with a single action with type "delete"', () => {
    const card = mount(<Menu actions={[deleteAction]} />);
    expect(card.find(MeatBallsWrapper)).toHaveLength(0);
    expect(card.find(DeleteBtn)).toHaveLength(1);
  });

  it('should call onToggle callback when meatballs are pressed', () => {
    const onToggle = jest.fn();
    const card = mount(<Menu actions={menuActions} onToggle={onToggle} />);

    card
      .find(DropdownMenu)
      .find('button')
      .simulate('click');
    expect(onToggle).toHaveBeenCalled();
  });

  // This is not currently testable. This requires that DropdownMenu exposes its own version of Item
  // to test against. Since there is already some refactor work being done in this area, we believe its
  // okay to remove this test until that time.
  // See: AK-3051, AK-2642 and AK-2978
  /* it('should call action handler when item is pressed', () => {
    const handler = jest.fn();
    const menuActions = [{label: 'x', handler}];
    const card = mount(<Menu actions={menuActions}/>);

    card.find(DropdownMenu).simulate('click');
    // The event listener is on the `Element` in Item which we cant select with a css selector
    // check /packages/droplist/test/unit/item.js
    card.find(Item).first().childAt(0).simulate('click');
    expect(handler).toHaveBeenCalled();
  }); */

  it('should pass supplied trigger color to meatballs wrapper when there are multiple actions', () => {
    const handler = jest.fn();
    const menuActions = [{ label: 'x', handler }, { label: 'y', handler }];

    const triggerColor = 'some-color-string';
    const card = mount(
      <Menu actions={menuActions} triggerColor={triggerColor} />,
    );
    expect(card.find(MeatBallsWrapper).prop('style')).toMatchObject({
      color: triggerColor,
    });
  });

  it('should pass supplied trigger color to delete button when there is a single action', () => {
    const menuActions = [deleteAction];

    const triggerColor = 'some-color-string';
    const card = mount(
      <Menu actions={menuActions} triggerColor={triggerColor} />,
    );
    expect(card.find(DeleteBtn).prop('style')).toMatchObject({
      color: triggerColor,
    });
  });
});
