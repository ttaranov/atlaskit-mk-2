// @flow
import React from 'react';
import { shallow } from 'enzyme';

import SkeletonContainerNavigation from '../../src/components/js/skeleton/SkeletonContainerNavigation';

import { WithRootTheme } from '../../src/theme/util';
import * as presets from '../../src/theme/presets';

describe('<SkeletonContainerNavigation />', () => {
  const DummyContainerHeader = () => <div />;

  it('wraps the content inside a <WithRootTheme />', () => {
    const rootThemeHoc = shallow(
      <SkeletonContainerNavigation
        theme={presets.container}
        containerHeaderComponent={DummyContainerHeader}
      />,
    ).first();

    expect(rootThemeHoc.type()).toBe(WithRootTheme);
    expect(rootThemeHoc.prop('provided')).toEqual(presets.container);
  });

  it('renders a skeleton representation of the container sidebar', () => {
    const containerNavigationStructure = shallow(
      <SkeletonContainerNavigation
        theme={presets.container}
        containerHeaderComponent={DummyContainerHeader}
      />,
    )
      .first()
      .children();

    expect(containerNavigationStructure).toMatchSnapshot();
  });

  it('shows the global sidebar items when collapsed', () => {
    const containerNavigationStructure = shallow(
      <SkeletonContainerNavigation
        theme={presets.container}
        containerHeaderComponent={DummyContainerHeader}
        isCollapsed
      />,
    )
      .first()
      .children();

    expect(containerNavigationStructure).toMatchSnapshot();
  });
});
