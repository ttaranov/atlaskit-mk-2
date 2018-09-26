import { BuildStatus } from '@atlassian/bitkit-builds';
import { shallowWithIntl, mountWithIntl } from 'enzyme-react-intl';
import toJson from 'enzyme-to-json';
import React from 'react';

import Commit from '../components/commit';

import { commitsArray, buildsArray } from './mock-data';

describe('Commit component', () => {
  it('without user data, matches the snapshot', () => {
    const wrapper = shallowWithIntl(<Commit commit={commitsArray[0]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('with user data, matches the snapshot', () => {
    const wrapper = shallowWithIntl(<Commit commit={commitsArray[1]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  describe('Build status', () => {
    function decorateCommit(commit) {
      return {
        ...commit,
        extra: {
          builds: buildsArray,
        },
      };
    }

    it('renders build status if the corresponding data is provided', () => {
      const commit = decorateCommit(commitsArray[0]);
      const wrapper = shallowWithIntl(<Commit commit={commit} />);
      const buildStatusColumn = wrapper.childAt(5);
      const buildStatus = buildStatusColumn.find(BuildStatus);

      expect(buildStatus).toHaveLength(1);
    });

    it("doesn't render build status if the corresponding data is not provided", () => {
      const wrapper = mountWithIntl(<Commit commit={commitsArray[0]} />);
      expect(wrapper.find(BuildStatus)).toHaveLength(0);
    });
  });
});
