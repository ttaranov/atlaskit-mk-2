// @flow
import React from 'react';
import { shallow } from 'enzyme';

import SkeletonDefaultContainerHeader from '../../src/components/js/skeleton/SkeletonDefaultContainerHeader';

describe('<SkeletonContainerItem />', () => {
  it('renders a skeleton representation of a container header', () => {
    expect(shallow(<SkeletonDefaultContainerHeader />)).toMatchSnapshot();
  });

  it('shows a compact version when collapsed', () => {
    expect(
      shallow(<SkeletonDefaultContainerHeader isCollapsed />),
    ).toMatchSnapshot();
  });
});
