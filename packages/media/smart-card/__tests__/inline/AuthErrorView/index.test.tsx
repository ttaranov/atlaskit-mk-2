import * as React from 'react';
import { mount } from 'enzyme';
import { truncateUrlForErrorView } from '../../../src/inline/utils';
import { AuthErrorView } from '../../../src/inline/AuthErrorView';

const URL =
  'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';
const trunkatedURL = truncateUrlForErrorView(URL);

describe('Unauth view', () => {
  it('should render the trancated url', () => {
    const element = mount(<AuthErrorView url={URL} onTryAgain={() => {}} />);
    expect(element.text()).toContain(trunkatedURL);
  });

  it('should do click if try again clicked', () => {
    const onClick = jest.fn();
    const element = mount(<AuthErrorView url={URL} onTryAgain={onClick} />);
    element.find('button').simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
