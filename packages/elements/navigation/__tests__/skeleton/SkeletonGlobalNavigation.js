// @flow
import React from 'react';
import { shallow } from 'enzyme';

import SkeletonGlobalNavigation from '../../src/components/js/skeleton/SkeletonGlobalNavigation';

import { WithRootTheme } from '../../src/theme/util';
import * as presets from '../../src/theme/presets';

describe('<SkeletonGlobalNavigation />', () => {
  it('wraps the content inside a <WithRootTheme />', () => {
    const rootThemeHoc = shallow(
      <SkeletonGlobalNavigation theme={presets.container} />,
    ).first();

    expect(rootThemeHoc.type()).toBe(WithRootTheme);
    expect(rootThemeHoc.prop('provided')).toEqual(presets.container);
  });

  it('renders a skeleton representation of the global sidebar', () => {
    const globalNavigationStructure = shallow(
      <SkeletonGlobalNavigation theme={presets.container} />,
    )
      .first()
      .children();

    expect(globalNavigationStructure).toMatchSnapshot();
  });
});
