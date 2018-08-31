import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { EventHandlers } from '@atlaskit/editor-common';
import Action from '../../../../react/marks/action';

describe('Renderer - React/Marks/Action', () => {
  const createAction = (eventHandlers = {}) =>
    mount(
      <Action
        markKey="test-action-key"
        title="some-title"
        target={{ key: 'test-target' }}
        parameters={{ test: 'some-value' }}
        eventHandlers={eventHandlers}
      >
        This is an action
      </Action>,
    );

  it('should wrap content with <span>-tag', () => {
    const mark = createAction();
    expect(mark.find('span').length).to.equal(1);
    mark.unmount();
  });

  it('should pass target to event handler', done => {
    const eventHandlers: EventHandlers = {
      action: {
        onClick: actionMark => {
          expect(actionMark).to.deep.equal({
            key: 'test-action-key',
            target: {
              key: 'test-target',
            },
            parameters: {
              test: 'some-value',
            },
          });
          done();
        },
      },
    };
    const mark = createAction(eventHandlers);
    mark.find('span').simulate('click');
    mark.unmount();
  });

  it('should not throw if event handler is not defined', () => {
    const eventHandlers: EventHandlers = {
      action: {},
    };
    const mark = createAction(eventHandlers);
    expect(() => {
      mark.find('span').simulate('click');
    }).not.to.throw();
    mark.unmount();
  });
});
