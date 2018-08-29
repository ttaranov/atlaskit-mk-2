import * as React from 'react';
import Button from '@atlaskit/button';
import SearchError from '../../components/SearchError';
import { mountWithIntl } from './helpers/_intl-enzyme-test-helper';

describe('SearchError', () => {
  it('should retry when clicking the try again button', () => {
    const retryMock = jest.fn();
    const wrapper = mountWithIntl(<SearchError onRetryClick={retryMock} />);
    const onClick: Function = wrapper.find(Button).prop('onClick');
    onClick();
    expect(retryMock).toHaveBeenCalled();
  });
});
