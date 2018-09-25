import { shallowWithIntl } from 'enzyme-react-intl';
import toJson from 'enzyme-to-json';
import React from 'react';

import Commit from '../components/commit';

import { commitsArray } from './mock-data';

describe('Commit component', () => {
  it('without user data, matches the snapshot', () => {
    const wrapper = shallowWithIntl(<Commit commit={commitsArray[0]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('with user data, matches the snapshot', () => {
    const wrapper = shallowWithIntl(<Commit commit={commitsArray[1]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
