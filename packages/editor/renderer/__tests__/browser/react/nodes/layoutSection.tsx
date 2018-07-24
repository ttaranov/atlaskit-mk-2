import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LayoutSection from '../../../../src/react/nodes/layoutSection';
import LayoutColumn from '../../../../src/react/nodes/layoutColumn';

describe('Renderer - React/Nodes/LayoutSection', () => {
  const layoutSection = shallow(
    <LayoutSection layoutType="two_equal">
      <LayoutColumn><p>test</p></LayoutColumn>
    </LayoutSection>
  );

  it('should wrap content with div[data-layout-type="two_equal"-tag', () => {
    expect(layoutSection.is('div[data-layout-type="two_equal"]')).to.equal(true);
  });
});
