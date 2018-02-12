// @flow
import React from 'react';
import { shallow } from 'enzyme';

import SkeletonContainerItems from '../../src/components/js/skeleton/SkeletonContainerItems';

describe('<SkeletonContainerItem />', () => {
  it('renders a skeleton representation of a container item', () => {
    expect(shallow(<SkeletonContainerItems />)).toMatchSnapshot();
  });

  it('collapses its children container items', () => {
    expect(shallow(<SkeletonContainerItems isCollapsed />)).toMatchSnapshot();
  });
});
