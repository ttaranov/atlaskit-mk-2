import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LayoutSection from '../../../../react/nodes/layoutSection';
import LayoutColumn from '../../../../react/nodes/layoutColumn';

describe('Renderer - React/Nodes/LayoutSection', () => {
  [
    'two_equal',
    'two_right_sidebar',
    'two_left_sidebar',
    'three_equal',
    'three_with_sidebars',
  ].forEach(layoutType => {
    describe(layoutType, () => {
      const layoutSection = shallow(
        <LayoutSection layoutType={layoutType}>
          <LayoutColumn>
            <p>test</p>
          </LayoutColumn>
        </LayoutSection>,
      );

      it(`should wrap content with div[data-layout-type="${layoutType}"-tag`, () => {
        expect(
          layoutSection.is(`div[data-layout-type="${layoutType}"]`),
        ).to.equal(true);
      });
    });
  });
});
