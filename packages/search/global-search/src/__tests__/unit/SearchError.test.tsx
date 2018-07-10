import * as React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import SearchError from '../../components/SearchError';

describe('SearchError', () => {
  it('should retry when clicking the try again button', () => {
    const retryMock = jest.fn();
    const wrapper = shallow(<SearchError onRetryClick={retryMock} />);
    const onClick: Function = wrapper.find(Button).prop('onClick');
    onClick();
    expect(retryMock).toHaveBeenCalled();
  });
});
