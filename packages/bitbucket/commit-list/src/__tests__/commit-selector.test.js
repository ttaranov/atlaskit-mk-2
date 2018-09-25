import { mountWithIntl } from 'enzyme-react-intl';
import React from 'react';

import CommitSelector from '../components/commit-selector';
import CommitList from '../components/commit-list';
import ShowAllCommits from '../components/show-all-commits';

import { commitsArray, commitsArrayNoParents } from './mock-data';

describe('CommitSelector component', () => {
  const wrapper = mountWithIntl(<CommitSelector commits={commitsArray} />);
  const wrapperNoParents = mountWithIntl(
    <CommitSelector commits={commitsArrayNoParents} />,
  );

  it('renders a CommitList with the showCommitSelector prop', () => {
    expect(wrapper.find(CommitList).prop('showCommitSelector')).toEqual(true);
  });

  it('displays the "Show all commits" option', () => {
    expect(wrapper.find(ShowAllCommits)).toHaveLength(1);
  });

  it('shows radio inputs before each commit', () => {
    expect(wrapper.find('input[type="radio"]')).toHaveLength(11);
  });

  describe('the onCommitRangeChange callback function', () => {
    const mockCommitRangeChange = jest.fn();
    it('is called with the start and end commits for a single commit', () => {
      wrapper.setProps({ onCommitRangeChange: mockCommitRangeChange });

      wrapper
        .find('input[type="radio"]')
        .at(1)
        .simulate('click');

      expect(mockCommitRangeChange).toBeCalledWith(
        'f22f269df5c111d79b13e8d9a7606ecd262240e0',
        'cf53ce01402dd301185909d7949ebcef86ba2068',
      );
    });

    it('is called with the start and end commits for a single commit when `parents` is missing', () => {
      wrapperNoParents.setProps({ onCommitRangeChange: mockCommitRangeChange });

      wrapperNoParents
        .find('input[type="radio"]')
        .at(1)
        .simulate('click');

      expect(mockCommitRangeChange).toBeCalledWith(
        'f22f269df5c111d79b13e8d9a7606ecd262240e0',
        'cf53ce01402dd301185909d7949ebcef86ba2068',
      );
    });

    it('is called with just the end commit for the "Show all commits" option', () => {
      wrapper.setProps({ onCommitRangeChange: mockCommitRangeChange });

      wrapper
        .find('input[type="radio"]')
        .first()
        .simulate('click');

      expect(mockCommitRangeChange).toBeCalledWith(
        '',
        'cf53ce01402dd301185909d7949ebcef86ba2068',
      );
    });

    it('is called with just the end commit for the "Show all commits" option when `parents` is missing', () => {
      wrapperNoParents.setProps({ onCommitRangeChange: mockCommitRangeChange });

      wrapperNoParents
        .find('input[type="radio"]')
        .first()
        .simulate('click');

      expect(mockCommitRangeChange).toBeCalledWith(
        '',
        'cf53ce01402dd301185909d7949ebcef86ba2068',
      );
    });

    it('is called with just end commit for the first commit', () => {
      wrapper.setProps({ onCommitRangeChange: mockCommitRangeChange });

      wrapper
        .find('input[type="radio"]')
        .last()
        .simulate('click');

      expect(mockCommitRangeChange).toBeCalledWith(
        '',
        'b7bce76588e66c8dc40e813a33ef3b903401d1cf',
      );
    });

    it('is called with just end commit for the first commit when `parents` is missing', () => {
      wrapperNoParents.setProps({ onCommitRangeChange: mockCommitRangeChange });

      wrapperNoParents
        .find('input[type="radio"]')
        .last()
        .simulate('click');

      expect(mockCommitRangeChange).toBeCalledWith(
        '',
        'b7bce76588e66c8dc40e813a33ef3b903401d1cf',
      );
    });
  });
});
