import * as React from 'react';
import { mount } from 'enzyme';
import { truncateUrlForErrorView } from '../../../src/inline/utils';
import { ForbiddenView } from '../../../src/inline/ForbiddenView';

const URL =
  'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';
const trunkatedURL = truncateUrlForErrorView(URL);

describe('Unauth view', () => {
  it('should render the trancated url', () => {
    const element = mount(<ForbiddenView url={URL} onRetry={() => {}} />);
    expect(element.text()).toContain(trunkatedURL);
  });

  it('should do click if try again clicked', () => {
    const onRetrySpy = jest.fn();
    const element = mount(<ForbiddenView url={URL} onRetry={onRetrySpy} />);
    element.find('button').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick if onRetry was triggered', () => {
    const onClickSpy = jest.fn();
    const onRetrySpy = jest.fn();
    const element = mount(
      <ForbiddenView url={URL} onRetry={onRetrySpy} onClick={onClickSpy} />,
    );
    element.find('button').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).not.toHaveBeenCalled();
  });
});
