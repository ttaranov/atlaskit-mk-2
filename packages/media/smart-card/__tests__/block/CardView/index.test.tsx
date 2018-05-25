import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { CardFrame, CardPreview, LinkIcon } from '@atlaskit/media-ui';
import ActionsView from '../../../src/block/CardView/ActionsView';
import { ResolvedView } from '../../../src/block/ResolvedView';
import AlertView from '../../../src/block/CardView/AlertView';
import { CardView } from '../../../src/block/CardView/index';

const pendingAction = {
  text: 'Like',
  handler: ({ progress }) => progress(),
};

const successActionWithoutMessage = {
  text: 'Like',
  handler: ({ success }) => success(),
};

const successActionWithMessage = {
  text: 'Like',
  handler: ({ success }) => success('Yey!'),
};

const failureAction = {
  text: 'Like',
  handler: ({ failure }) => failure(),
};

describe('CardView', () => {
  const preview = 'https://www.example.com/foo.jpg';

  it('should render a href when href is provided', () => {
    const element = shallow(<CardView link="https://www.google.com/" />);
    expect(element.find(CardFrame).prop('href')).toEqual(
      'https://www.google.com/',
    );
  });

  it('should not render a href when href is not provided', () => {
    const element = shallow(<CardView />);
    expect(element.find(CardFrame).prop('href')).toBeUndefined();
  });

  it('should render text in the frame when context is provided', () => {
    const element = shallow(<CardView context={{ text: 'Jira' }} />);
    expect(element.find(CardFrame).prop('text')).toEqual('Jira');
  });

  it('should not render text in the frame when context is not provided', () => {
    const element = shallow(<CardView />);
    expect(element.find(CardFrame).prop('text')).toBeUndefined();
  });

  it('should render icon URL in the frame when context is provided', () => {
    const element = shallow(
      <CardView
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
    const element = shallow(<CardView />);
    expect(element.find(CardFrame).prop('icon')).toEqual(<LinkIcon />);
  });

  it('it should render a preview when there is a preview', () => {
    const element = shallow(<CardView preview={preview} />);
    expect(element.find(CardPreview)).toHaveLength(1);
  });

  it('it should not render a preview when there is no preview', () => {
    const element = shallow(<CardView />);
    expect(element.find(CardPreview)).toHaveLength(0);
  });

  it('it should not render a thumbnail when there is a preview', () => {
    const element = shallow(<CardView preview={preview} />);
    expect(element.find(ResolvedView).prop('thumbnail')).toBeUndefined();
  });

  it('it should not render a thumbnail when there is no preview', () => {
    const element = shallow(<CardView />);
    expect(element.find(ResolvedView).prop('thumbnail')).toBeUndefined();
  });

  it('should have a minWidth of 240 when there is a preview', () => {
    const element = shallow(<CardView preview={preview} />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a minWidth of 240 when there is no preview', () => {
    const element = shallow(<CardView />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(240);
  });

  it('should have a maxWidth of 400 when there is a preview', () => {
    const element = shallow(<CardView preview={preview} />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(400);
  });

  it('should have a maxWidth of 664 when there is no preview', () => {
    const element = shallow(<CardView />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(664);
  });

  it('should render a spinner instead of actions when an action is pending', () => {
    const element = mount(<CardView actions={[pendingAction]} />);
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
    const element = mount(<CardView actions={[failureAction]} />);
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

  it('should render the alert when an action succeeds with a message', () => {
    const element = mount(<CardView actions={[successActionWithMessage]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(successActionWithMessage);
    }
    element.update();
    expect(element.find(AlertView).exists()).toBeTruthy();
    expect(element.find(AlertView).prop('type')).toEqual('success');
    expect(element.find(AlertView).prop('message')).toEqual('Yey!');
  });

  it('should not render the alert when an action succeeds without a message', () => {
    const element = mount(<CardView actions={[successActionWithoutMessage]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(successActionWithoutMessage);
    }
    element.update();
    expect(element.find(AlertView).exists()).toBeFalsy();
  });

  it('should render the alert when an action failed', () => {
    const element = mount(<CardView actions={[failureAction]} />);
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
    const element = mount(<CardView actions={[successActionWithMessage]} />);
    const onAction = element
      .find(ActionsView)
      .first()
      .prop('onAction');
    if (onAction) {
      onAction(successActionWithMessage);
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
