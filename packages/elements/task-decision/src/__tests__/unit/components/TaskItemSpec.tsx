import * as React from 'react';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import TaskItem from '../../../components/TaskItem';
import Participants from '../../../components/Participants';
import { AttributionWrapper, ContentWrapper } from '../../../styled/Item';
import { Placeholder } from '../../../styled/Placeholder';
import { getParticipants } from '../_test-data';

describe('<TaskItem/>', () => {
  it('should render children', () => {
    const component = mount(
      <TaskItem taskId="task-1">
        Hello <b>world</b>
      </TaskItem>,
    );
    expect(component.find('b').length).toEqual(1);
    expect(component.find(ContentWrapper).text()).toEqual('Hello world');
  });

  it('should render callback with ref', () => {
    let contentRef: HTMLElement | undefined;
    const handleContentRef = ref => (contentRef = ref);
    const component = mount(
      <TaskItem taskId="task-id" contentRef={handleContentRef}>
        Hello <b>world</b>
      </TaskItem>,
    );
    expect(component.find('b').length).toEqual(1);
    expect(contentRef).not.toEqual(undefined);
    expect(contentRef!.textContent).toEqual('Hello world');
  });

  it('should disable input if disabled', () => {
    const component = mount(
      <TaskItem taskId="task-1" disabled={true}>
        Hello <b>world</b>
      </TaskItem>,
    );
    expect(component.find('input').prop('disabled')).toEqual(true);
  });

  describe('clicking', () => {
    it('should call onChange when checkbox is clicked', () => {
      const spy = sinon.spy();
      const component = mount(
        <TaskItem taskId="task-1" onChange={spy}>
          Hello <b>world</b>
        </TaskItem>,
      );
      component.find('input').simulate('change');
      expect(spy.calledWith('task-1', true)).toEqual(true);
    });
  });

  describe('showPlaceholder', () => {
    it('should render placeholder if task is empty', () => {
      const component = mount(
        <TaskItem taskId="task-1" showPlaceholder={true} />,
      );
      const placeholder = component.find(Placeholder);
      expect(placeholder.text()).toEqual(
        "Type your action, use '@' to assign to someone.",
      );
    });

    it('should not render placeholder if task is not empty', () => {
      const component = mount(
        <TaskItem taskId="task-1" showPlaceholder={true}>
          Hello <b>world</b>
        </TaskItem>,
      );
      expect(component.find(Placeholder).length).toEqual(0);
    });
  });

  describe('participants', () => {
    const participants = getParticipants(2);

    it('participants not used for inline style item', () => {
      const component = mount(
        <TaskItem
          taskId="task-1"
          appearance="inline"
          participants={participants}
        />,
      );
      expect(component.find(Participants).length).toEqual(0);
    });

    it('participants used for card style item', () => {
      const component = mount(
        <TaskItem
          taskId="task-1"
          appearance="card"
          participants={participants}
        />,
      );
      const participantsComponents = component.find(Participants);
      expect(participantsComponents.length).toEqual(1);
      expect(participantsComponents.at(0).prop('participants')).toEqual(
        participants,
      );
    });
  });

  describe('attribution', () => {
    const users = getParticipants(2);
    const user1 = users[0];
    const user2 = users[1];

    it('No creator or lastUpdater', () => {
      const component = mount(
        <TaskItem taskId="task-1" appearance="card" isDone={false} />,
      );
      expect(component.find(AttributionWrapper).length).toEqual(0);
    });

    it('Creator, no updater, not done', () => {
      const component = mount(
        <TaskItem
          taskId="task-1"
          appearance="card"
          creator={user1}
          isDone={false}
        />,
      );
      const attributionWrapper = component.find(AttributionWrapper);
      expect(attributionWrapper.length).toEqual(1);
      expect(attributionWrapper.at(0).text()).toEqual(
        `Added by ${user1.displayName}`,
      );
    });

    it('Creator, no updater, done', () => {
      const component = mount(
        <TaskItem
          taskId="task-1"
          appearance="card"
          creator={user1}
          isDone={true}
        />,
      );
      const attributionWrapper = component.find(AttributionWrapper);
      expect(attributionWrapper.length).toEqual(1);
      // No lastUpdater, so stays with Added by
      expect(attributionWrapper.at(0).text()).toEqual(
        `Added by ${user1.displayName}`,
      );
    });

    it('Creator and lastUpdater, not done', () => {
      const component = mount(
        <TaskItem
          taskId="task-1"
          appearance="card"
          creator={user1}
          lastUpdater={user2}
          isDone={false}
        />,
      );
      const attributionWrapper = component.find(AttributionWrapper);
      expect(attributionWrapper.length).toEqual(1);
      expect(attributionWrapper.at(0).text()).toEqual(
        `Added by ${user1.displayName}`,
      );
    });

    it('Creator and lastUpdater, done', () => {
      const component = mount(
        <TaskItem
          taskId="task-1"
          appearance="card"
          creator={user1}
          lastUpdater={user2}
          isDone={true}
        />,
      );
      const attributionWrapper = component.find(AttributionWrapper);
      expect(attributionWrapper.length).toEqual(1);
      expect(attributionWrapper.at(0).text()).toEqual(
        `Completed by ${user2.displayName}`,
      );
    });

    it('Creator and lastUpdater, done, inline - no attribution', () => {
      const component = mount(
        <TaskItem
          taskId="task-1"
          appearance="inline"
          creator={user1}
          lastUpdater={user2}
          isDone={true}
        />,
      );
      const attributionWrapper = component.find(AttributionWrapper);
      expect(attributionWrapper.length).toEqual(0);
    });
  });
});
