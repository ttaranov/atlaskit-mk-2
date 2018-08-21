import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { AppCardAction } from '../../../model';
import { ActionsView } from '../../../components/ActionsView';
import Button from '@atlaskit/button';
import DropdownMenu from '@atlaskit/dropdown-menu';
import {
  ActionsMenu,
  SuccessMessage,
  FailureMessage,
} from '../../../styled/ActionsView';

describe('ActionsView', () => {
  it('should render no button and no menu items when there are zero actions', () => {
    const actions: AppCardAction[] = [];
    const element = shallow(
      <ActionsView actions={actions} isInversed={false} />,
    );
    expect(element.find(Button)).toHaveLength(0);
    expect(element.find(ActionsMenu)).toHaveLength(0);
  });

  it('should render a button and zero menu items when there is one action', () => {
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.receiver',
          key: 'test.target',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = shallow(
      <ActionsView actions={actions} isInversed={false} />,
    );
    expect(element.find(Button)).toHaveLength(1);
    expect(element.find(ActionsMenu)).toHaveLength(0);
  });

  it('should render a two buttons and zero menu items when there is two actions', () => {
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
      {
        title: 'Join',
        target: {
          receiver: 'some.app',
          key: 'test.target2',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = shallow(
      <ActionsView actions={actions} isInversed={false} />,
    );
    expect(element.find(Button)).toHaveLength(2);
    expect(element.find(ActionsMenu)).toHaveLength(0);
  });

  it('should render a button and two menu items when there are more than two actions', () => {
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.receiver1',
          key: 'test.target.open',
        },
        parameters: {
          expenseId: 'some-id1',
        },
      },
      {
        title: 'View',
        target: {
          receiver: 'some.receiver2',
          key: 'test.target.view',
        },
        parameters: {
          expenseId: 'some-id2',
        },
      },
      {
        title: 'Reply',
        target: {
          receiver: 'some.receiver3',
          key: 'test.target.reply',
        },
        parameters: {
          expenseId: 'some-id3',
        },
      },
      {
        title: 'Join',
        target: {
          receiver: 'some.app3',
          key: 'test.target.reply',
        },
        parameters: {
          expenseId: 'some-id3',
        },
      },
    ];
    const element = shallow(
      <ActionsView actions={actions} isInversed={false} />,
    );
    expect(element.find(Button)).toHaveLength(3);
    expect(element.find(DropdownMenu)).toHaveLength(1);
    const groups: Array<any> = element.find(DropdownMenu).prop('items')!;
    expect(groups).toHaveLength(1);
    expect(groups[0].items).toHaveLength(2);
    expect(groups[0].items[0]).toHaveProperty('content', 'Reply');
    expect(groups[0].items[1]).toHaveProperty('content', 'Join');
    expect(element.find(SuccessMessage)).toHaveLength(0);
    expect(element.find(FailureMessage)).toHaveLength(0);
  });

  it('should render success message and no buttons', () => {
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(<ActionsView actions={actions} isInversed={false} />);
    expect(element.find(Button)).toHaveLength(1);
    expect(element.find(SuccessMessage)).toHaveLength(0);
    element.setState({
      successMessage: 'test success',
    });
    expect(element.find(Button)).toHaveLength(0);
    expect(element.find(ActionsMenu)).toHaveLength(0);
    expect(element.find(SuccessMessage)).toHaveLength(1);
    expect(element.find(SuccessMessage).text()).toBe('test success');
  });

  it('should render failure message and no buttons', () => {
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(<ActionsView actions={actions} isInversed={false} />);
    expect(element.find(Button)).toHaveLength(1);
    expect(element.find(SuccessMessage)).toHaveLength(0);
    element.setState({
      failureMessage: 'test failure',
    });
    expect(element.find(Button)).toHaveLength(0);
    expect(element.find(ActionsMenu)).toHaveLength(0);
    expect(element.find(FailureMessage)).toHaveLength(1);
    expect(element.find(FailureMessage).text()).toBe('test failure');
  });

  it('should render try again button with failure message and no buttons', () => {
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(<ActionsView actions={actions} isInversed={false} />);
    expect(element.find(Button)).toHaveLength(1);
    expect(element.find(SuccessMessage)).toHaveLength(0);
    element.setState({
      failureMessage: 'test failure',
      tryAgain: true,
      tryAgainLinkText: 'test try again',
    });
    expect(element.find(ActionsMenu)).toHaveLength(0);
    expect(element.find(FailureMessage)).toHaveLength(1);
    expect(element.find(FailureMessage).text()).toBe('test failure');
    expect(element.find(Button)).toHaveLength(1);
    expect(element.find(Button).prop('appearance')).toBe('link');
    expect(element.find(Button).text()).toBe('test try again');
  });

  it('should reset failure state on clicking try again button', () => {
    const event = {
      stopPropagation: jest.fn(),
    };
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(<ActionsView actions={actions} isInversed={false} />);
    element.setState({
      failureMessage: 'test failure',
      tryAgain: true,
      tryAgainLinkText: 'test try again',
    });
    element.find(Button).simulate('click', event);
    expect(event.stopPropagation).toHaveBeenCalledWith();
    expect(element.state()).toEqual({
      actionInProgress: null,
      failureMessage: null,
      successMessage: null,
      tryAgain: false,
      tryAgainLinkText: null,
    });
  });

  it('should pass action and progress handlers to callback on button click', () => {
    const onActionClickSpy = jest.fn();
    const createCallbackHandlersSpy = jest.spyOn(
      ActionsView.prototype,
      'createCallbackHandlers',
    );
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(
      <ActionsView
        actions={actions}
        isInversed={false}
        onActionClick={onActionClickSpy}
      />,
    );
    element.find(Button).simulate('click');
    expect(createCallbackHandlersSpy).toHaveBeenCalledWith(0);
    expect(onActionClickSpy).toHaveBeenCalledWith(actions[0], {
      failure: expect.any(Function),
      success: expect.any(Function),
      progress: expect.any(Function),
    });
  });

  it('should update state on progress handler execution', () => {
    const event = {
      stopPropagation: jest.fn(),
    };
    const onActionClickSpy = jest
      .fn()
      .mockImplementation((action, handlers) => {
        handlers.progress();
      });
    const createCallbackHandlersSpy = jest.spyOn(
      ActionsView.prototype,
      'createCallbackHandlers',
    );
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
      {
        title: 'Join',
        target: {
          receiver: 'some.app',
          key: 'test.target2',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(
      <ActionsView
        actions={actions}
        isInversed={false}
        onActionClick={onActionClickSpy}
      />,
    );
    element
      .find(Button)
      .at(1)
      .simulate('click', event);
    expect(onActionClickSpy).toHaveBeenCalledWith(actions[1], {
      failure: expect.any(Function),
      success: expect.any(Function),
      progress: expect.any(Function),
    });
    expect(event.stopPropagation).toHaveBeenCalledWith();
    expect(createCallbackHandlersSpy).toHaveBeenCalledWith(1);
    expect(element.state()).toEqual(
      expect.objectContaining({
        actionInProgress: 1,
      }),
    );
  });

  it('should update state on success handler execution', () => {
    const event = {
      stopPropagation: jest.fn(),
    };
    const onActionClickSpy = jest
      .fn()
      .mockImplementation((action, handlers) => {
        handlers.success('some success');
      });
    const createCallbackHandlersSpy = jest.spyOn(
      ActionsView.prototype,
      'createCallbackHandlers',
    );
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
      {
        title: 'Join',
        target: {
          receiver: 'some.app',
          key: 'test.target2',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(
      <ActionsView
        actions={actions}
        isInversed={false}
        onActionClick={onActionClickSpy}
      />,
    );
    element
      .find(Button)
      .at(0)
      .simulate('click', event);
    expect(onActionClickSpy).toHaveBeenCalledWith(actions[0], {
      failure: expect.any(Function),
      success: expect.any(Function),
      progress: expect.any(Function),
    });
    expect(event.stopPropagation).toHaveBeenCalledWith();
    expect(createCallbackHandlersSpy).toHaveBeenCalledWith(0);
    expect(element.state()).toEqual(
      expect.objectContaining({
        actionInProgress: null,
        successMessage: 'some success',
      }),
    );
  });

  it('should update state on failure handler execution', () => {
    const onActionClickSpy = jest
      .fn()
      .mockImplementation((action, handlers) => {
        handlers.failure('some failure', true, 'test try again');
      });
    const createCallbackHandlersSpy = jest.spyOn(
      ActionsView.prototype,
      'createCallbackHandlers',
    );
    const actions: AppCardAction[] = [
      {
        title: 'Open',
        target: {
          receiver: 'some.app',
          key: 'test.target1',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
      {
        title: 'Join',
        target: {
          receiver: 'some.app',
          key: 'test.target2',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
      {
        title: 'Apply',
        target: {
          receiver: 'some.app',
          key: 'test.target2',
        },
        parameters: {
          expenseId: 'some-id',
        },
      },
    ];
    const element = mount(
      <ActionsView
        actions={actions}
        isInversed={false}
        onActionClick={onActionClickSpy}
      />,
    );

    const onItemActivated: Function = element
      .find(DropdownMenu)
      .prop('onItemActivated')!;
    onItemActivated({
      item: { action: { appCardAction: actions[2], key: 3 } },
    });

    expect(onActionClickSpy).toHaveBeenCalledWith(actions[2], {
      failure: expect.any(Function),
      success: expect.any(Function),
      progress: expect.any(Function),
    });
    expect(createCallbackHandlersSpy).toHaveBeenCalledWith(3);
    expect(element.state()).toEqual(
      expect.objectContaining({
        actionInProgress: null,
        failureMessage: 'some failure',
        tryAgain: true,
        tryAgainLinkText: 'test try again',
      }),
    );
  });
});
