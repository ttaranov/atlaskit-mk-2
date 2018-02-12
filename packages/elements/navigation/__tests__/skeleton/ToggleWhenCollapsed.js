// @flow
import React from 'react';
import { shallow } from 'enzyme';

import {
  ShownWhenCollapsed,
  HiddenWhenCollapsed,
} from '../../src/components/js/skeleton/ToggleWhenCollapsed';

describe('Toggle when collapsed HOCs', () => {
  const DummyComponent = () => <div />;

  describe('<ShownWhenCollapsed />', () => {
    it('renders its children when collapsed', () => {
      expect(
        shallow(
          <ShownWhenCollapsed isCollapsed>
            <DummyComponent />
          </ShownWhenCollapsed>,
        ).find(DummyComponent),
      ).toHaveLength(1);
    });

    it('renders no children when not collapsed', () => {
      expect(
        shallow(
          <ShownWhenCollapsed isCollapsed={false}>
            <DummyComponent />
          </ShownWhenCollapsed>,
        ).find(DummyComponent),
      ).toHaveLength(0);
    });
  });

  describe('<HiddenWhenCollapsed />', () => {
    it('renders no children when collapsed', () => {
      expect(
        shallow(
          <HiddenWhenCollapsed isCollapsed>
            <DummyComponent />
          </HiddenWhenCollapsed>,
        ).find(DummyComponent),
      ).toHaveLength(0);
    });

    it('renders its children when not collapsed', () => {
      expect(
        shallow(
          <HiddenWhenCollapsed isCollapsed={false}>
            <DummyComponent />
          </HiddenWhenCollapsed>,
        ).find(DummyComponent),
      ).toHaveLength(1);
    });
  });
});
