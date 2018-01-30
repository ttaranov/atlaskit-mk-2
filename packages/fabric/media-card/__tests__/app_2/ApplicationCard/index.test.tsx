import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import CardFrame from '../../../src/shared/CardFrame';
import CardPreview from '../../../src/shared/CardPreview';
import LinkIcon from '../../../src/shared/LinkIcon';
import CardDetails from '../../../src/app_2/shared/CardDetails';
import ActionsView from '../../../src/app_2/shared/ActionsView';
import AlertView from '../../../src/app_2/shared/AlertView';
import ApplicationCard from '../../../src/app_2/ApplicationCard';

const pendingAction = {
  text: 'Like',
  handler: ({ progress }) => progress(),
};

const successAction = {
  text: 'Like',
  handler: ({ success }) => success('Yey!'),
};

const failureAction = {
  text: 'Like',
  handler: ({ failure }) => failure(),
};

describe('ApplicationCard', () => {
  const preview = 'https://www.example.com/foo.jpg';

  it('should render a link when link is provided', () => {
    const element = shallow(<ApplicationCard link="https://www.google.com/" />);
    expect(element.find(CardFrame).prop('href')).toEqual(
      'https://www.google.com/',
    );
  });

  it('should not render a link when link is not provided', () => {
    const element = shallow(<ApplicationCard />);
    expect(element.find(CardFrame).prop('href')).toBeUndefined();
  });

  it('should render text in the frame when context is provided', () => {
    const element = shallow(<ApplicationCard context={{ text: 'Jira' }} />);
    expect(element.find(CardFrame).prop('text')).toEqual('Jira');
  });

  it('should not render text in the frame when context is not provided', () => {
    const element = shallow(<ApplicationCard />);
    expect(element.find(CardFrame).prop('text')).toBeUndefined();
  });

  it('should render icon URL in the frame when context is provided', () => {
    const element = shallow(
      <ApplicationCard
        context={{
          text: 'Jira',
          icon: 'https://www.google.com/',
        }}
      />,
    );
    expect(element.find(CardFrame).prop('icon')).toEqual(
      <LinkIcon src="https://www.google.com/" />,
    );
  });

  it('should not render icon URL in the frame when context is not provided', () => {
    const element = shallow(<ApplicationCard />);
    expect(element.find(CardFrame).prop('icon')).toEqual(<LinkIcon />);
  });

  it('it should render a preview when there is a preview', () => {
    const element = shallow(<ApplicationCard preview={preview} />);
    expect(element.find(CardPreview)).toHaveLength(1);
  });

  it('it should not render a preview when there is no preview', () => {
    const element = shallow(<ApplicationCard />);
    expect(element.find(CardPreview)).toHaveLength(0);
  });

  it('it should not render a thumbnail when there is a preview', () => {
    const element = shallow(<ApplicationCard preview={preview} />);
    expect(element.find(CardDetails).prop('thumbnail')).toBeUndefined();
  });

  it('it should not render a thumbnail when there is no preview', () => {
    const element = shallow(<ApplicationCard />);
    expect(element.find(CardDetails).prop('thumbnail')).toBeUndefined();
  });

  it('should have a minWidth of 240 when there is a preview', () => {
    const element = shallow(<ApplicationCard preview={preview} />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a minWidth of 240 when there is no preview', () => {
    const element = shallow(<ApplicationCard />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a maxWidth of 400 when there is a preview', () => {
    const element = shallow(<ApplicationCard preview={preview} />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(400);
  });

  it('should have a maxWidth of 664 when there is no preview', () => {
    const element = shallow(<ApplicationCard />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(664);
  });

  it('should render a spinner instead of actions when an action is pending', () => {
    const element = mount(<ApplicationCard actions={[pendingAction]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(pendingAction);
    }
    element.update();
    expect(element.find(Spinner).exists()).toBeTruthy();
    expect(element.find(ActionsView).exists()).toBeFalsy();
  });

  it('should render a warning icon instead of actions when an action is failed', () => {
    const element = mount(<ApplicationCard actions={[failureAction]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(failureAction);
    }
    element.update();
    expect(element.find(WarningIcon).exists()).toBeTruthy();
    expect(element.find(ActionsView).exists()).toBeFalsy();
  });

  it('should render the alert when an action succeeds', () => {
    const element = mount(<ApplicationCard actions={[successAction]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(successAction);
    }
    element.update();
    expect(element.find(AlertView).exists()).toBeTruthy();
    expect(element.find(AlertView).prop('type')).toEqual('success');
    expect(element.find(AlertView).prop('message')).toEqual('Yey!');
  });

  it('should render the alert when an action failed', () => {
    const element = mount(<ApplicationCard actions={[failureAction]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(failureAction);
    }
    element.update();
    expect(element.find(AlertView).exists()).toBeTruthy();
    expect(element.find(AlertView).prop('type')).toEqual('failure');
  });

  it('should not render the alert after 2 seconds when an action succeeds', done => {
    jest.useFakeTimers();
    const element = mount(<ApplicationCard actions={[successAction]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(successAction);
    }
    setTimeout(() => {
      element.update();
      try {
        expect(element.find(AlertView).exists()).toBeFalsy();
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 4000); // FIXME
    jest.runAllTimers();
  });
});
