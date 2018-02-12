// @flow
import React from 'react';
import { shallow } from 'enzyme';

import SkeletonContainerItem from '../../src/components/js/skeleton/SkeletonContainerItem';

describe('<SkeletonContainerItem />', () => {
  it('renders a skeleton representation of a container item', () => {
    expect(shallow(<SkeletonContainerItem />)).toMatchSnapshot();
  });

  it('shows a compact version when collapsed', () => {
    expect(shallow(<SkeletonContainerItem isCollapsed />)).toMatchSnapshot();
  });
});
