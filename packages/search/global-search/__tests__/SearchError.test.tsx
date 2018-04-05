import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Button from '@atlaskit/button';
import SearchError from '../src/components/SearchError';

describe('SearchError', () => {
  it('should retry when clicking the try again button', () => {
    const retryMock = jest.fn();
    const wrapper = shallow(<SearchError onRetryClick={retryMock} />);

    wrapper.find(Button).prop('onClick')();
    expect(retryMock).toHaveBeenCalled();
  });
});
