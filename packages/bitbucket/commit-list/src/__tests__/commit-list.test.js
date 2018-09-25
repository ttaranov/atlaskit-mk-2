import { shallowWithIntl } from 'enzyme-react-intl';
import React from 'react';
import Button from '@atlaskit/button';
import * as styles from '../styles';

import CommitList from '../components/commit-list';
import Commit from '../components/commit';

import { commitsArray } from './mock-data';

describe('CommitList component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowWithIntl(<CommitList commits={commitsArray} />);
  });

  it('shows list of commits', () => {
    expect(wrapper.find(Commit)).toHaveLength(commitsArray.length);
  });

  it('display the show more link if hasMore is true', () => {
    wrapper.setProps({ hasMore: true });
    expect(wrapper.find(styles.ShowMoreBtnContainer)).toHaveLength(1);
  });

  it('hide the show more link if hasMore is false', () => {
    wrapper.setProps({ hasMore: false });
    expect(wrapper.find(styles.ShowMoreBtnContainer)).toHaveLength(0);
  });

  it('shows loading spinner when isLoading is true', () => {
    wrapper.setProps({ isLoading: true });
    expect(wrapper.find(styles.CommitsLoadingSpinner).length).toBe(1);
  });

  it('calls onShowMoreClick when the "show more" button is clicked', () => {
    const onShowMoreClick = jest.fn();
    wrapper.setProps({ hasMore: true, onShowMoreClick });

    wrapper
      .find(styles.ShowMoreBtnContainer)
      .find(Button)
      .simulate('click');

    expect(onShowMoreClick).toHaveBeenCalledTimes(1);
  });

  describe('Build status', () => {
    let shouldHaveBuilds;
    const originalHasBuilds = CommitList.prototype.hasBuilds;

    function getColumnDefinitions(container) {
      return container.find(styles.Commits).find('colgroup');
    }

    beforeAll(() => {
      CommitList.prototype.hasBuilds = jest.fn(() => shouldHaveBuilds);
    });

    afterAll(() => {
      CommitList.prototype.hasBuilds = originalHasBuilds;
    });

    it('renders column definition for builds if commits has builds', () => {
      shouldHaveBuilds = true;
      const commitsWrapper = shallowWithIntl(
        <CommitList commits={commitsArray} />,
      );
      const columnDefinitions = getColumnDefinitions(commitsWrapper);

      expect(
        columnDefinitions.find(styles.BuildsColumnDefinition),
      ).toHaveLength(1);
    });

    it("doesn't render builds column definition if commits has no builds", () => {
      shouldHaveBuilds = false;
      const commitsWrapper = shallowWithIntl(
        <CommitList commits={commitsArray} />,
      );
      const columnDefinitions = getColumnDefinitions(commitsWrapper);

      expect(
        columnDefinitions.find(styles.BuildsColumnDefinition),
      ).toHaveLength(0);
    });
  });
});
