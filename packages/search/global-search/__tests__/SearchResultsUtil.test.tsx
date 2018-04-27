import * as React from 'react';
import { shallow } from 'enzyme';
import { ResultBase } from '@atlaskit/quick-search';
import { searchPeopleItem } from '../src/components/SearchResultsUtil';

it('should append query to search people item', () => {
  const wrapper = shallow(searchPeopleItem('test query'));
  expect(wrapper.prop('href')).toEqual('/home/people?q=test%20query');
});
