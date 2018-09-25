import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { ReactionConsumer } from '../../../reaction-store/ReactionConsumer';
import { Context } from '../../../reaction-store/Context';
import { ReactionStatus } from '../../../types/ReactionStatus';

describe('ReactionConsumer', () => {
  const children = jest.fn();
  const stateMapper = jest.fn();
  const actionsMapper = jest.fn();
  const actions = {
    addReaction: jest.fn(),
  };
  const value = {
    reactions: {},
    flash: {},
  };
  const mappedActions = {
    onSelection: jest.fn(),
  };

  const mappedState = {
    someValue: 1,
  };

  let consumer;

  beforeAll(() => {
    actionsMapper.mockReturnValue(mappedActions);
    stateMapper.mockReturnValue(mappedState);
  });

  beforeEach(() => {
    children.mockClear();
    stateMapper.mockClear();
    actionsMapper.mockClear();
    consumer = shallow(
      <ReactionConsumer stateMapper={stateMapper} actionsMapper={actionsMapper}>
        {children}
      </ReactionConsumer>,
    );

    consumer.find(Context.Consumer).prop('children')({
      value,
      actions,
    });
  });

  it('should map state', () => {
    expect(stateMapper).toHaveBeenCalledTimes(1);
    expect(stateMapper).toHaveBeenCalledWith(value);
    expect(children).toHaveBeenCalledWith(expect.objectContaining(mappedState));
  });

  it('should map actions', () => {
    expect(actionsMapper).toHaveBeenCalledTimes(1);
    expect(actionsMapper).toHaveBeenCalledWith(actions);
    expect(children).toHaveBeenCalledWith(
      expect.objectContaining(mappedActions),
    );
  });

  it('should map actions only once to avoid rerenders', () => {
    expect(stateMapper).toHaveBeenCalledTimes(1);
    expect(stateMapper).toHaveBeenCalledWith(value);

    expect(actionsMapper).toHaveBeenCalledTimes(1);
    expect(actionsMapper).toHaveBeenCalledWith(actions);

    expect(children).toHaveBeenCalledWith({ ...mappedState, ...mappedActions });

    const newValue = {
      reactions: {
        ['someari|otherari']: {
          status: ReactionStatus.loading,
        },
      },
      flash: {},
    };

    const newMapped = {
      status: ReactionStatus.loading,
      reactions: [],
    };

    stateMapper.mockReturnValueOnce(newMapped);

    consumer.find(Context.Consumer).prop('children')({
      value: newValue,
      actions,
    });

    expect(stateMapper).toHaveBeenCalledTimes(2);
    expect(stateMapper).toHaveBeenCalledWith(newValue);
    expect(actionsMapper).toHaveBeenCalledTimes(1);

    expect(children).toHaveBeenCalledWith({ ...newMapped, ...mappedActions });
  });

  it('should fail when ', () => {
    expect(() =>
      mount(<ReactionConsumer>{() => <div />}</ReactionConsumer>),
    ).toThrow(
      'ReactionContext is required. See https://atlaskit.atlassian.com/packages/elements/reactions.',
    );
  });
});
