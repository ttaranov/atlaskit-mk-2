import * as React from 'react'; // eslint-disable-line
import { mount } from 'enzyme';
import { expect } from 'chai';
import Button from '@atlaskit/button';

import { ErrorView } from '../../errorView';
import {
  errorHintRetry,
  errorHintCritical,
  errorButtonRetry,
  errorButtonCancel,
  errorButtonClose,
} from '../../../phrases';
import {
  ErrorPopup,
  ErrorIconWrapper,
  ErrorMessage,
  ErrorHint,
} from '../../styles';

describe('ErrorView', () => {
  const message = 'some-message';
  const onRetry = () => {};
  const onCancel = () => {};

  it('should display one button in case of critical error', () => {
    const errorView = mount(
      <ErrorView message={message} onCancel={onCancel} />,
    );
    expect(errorView.find(ErrorPopup)).to.have.length(1);
    expect(errorView.find(ErrorIconWrapper)).to.have.length(1);

    const mainMessage = errorView.find(ErrorMessage);
    expect(mainMessage).to.have.length(1);
    expect(mainMessage.first().text()).to.equal(message);

    const hint = errorView.find(ErrorHint);
    expect(hint).to.have.length(1);
    expect(hint.first().text()).to.equal(errorHintCritical);

    const buttons = errorView.find(Button);
    expect(buttons).to.have.length(1);
    expect(buttons.first().text()).to.equal(errorButtonClose);
  });

  it('should display two buttons in case of retriable error', () => {
    const errorView = mount(
      <ErrorView message={message} onRetry={onRetry} onCancel={onCancel} />,
    );
    expect(errorView.find(ErrorPopup)).to.have.length(1);
    expect(errorView.find(ErrorIconWrapper)).to.have.length(1);

    const mainMessage = errorView.find(ErrorMessage);
    expect(mainMessage).to.have.length(1);
    expect(mainMessage.first().text()).to.equal(message);

    const hint = errorView.find(ErrorHint);
    expect(hint).to.have.length(1);
    expect(hint.first().text()).to.equal(errorHintRetry);

    const buttons = errorView.find(Button);
    expect(buttons).to.have.length(2);
    expect(buttons.at(0).text()).to.equal(errorButtonRetry);
    expect(buttons.at(1).text()).to.equal(errorButtonCancel);
  });
});
