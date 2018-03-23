import * as React from 'react';
import { shallow } from 'enzyme';
import { inlineExtensionData } from '@atlaskit/editor-test-helpers';

import Lozenge, {
  ICON_SIZE,
} from '../../../../src/plugins/extension/ui/Extension/Lozenge';
import { PlaceholderFallback } from '../../../../src/plugins/extension/ui/Extension/styles';

describe('@atlaskit/editor-core/ui/Extension/Lozenge', () => {
  it('should render image if extension has an image param', () => {
    const lozenge = shallow(<Lozenge node={inlineExtensionData[0] as any} />);
    expect(lozenge.find('img')).toHaveLength(1);
  });

  it('should render icon with fallback width and height', () => {
    const lozenge = shallow(<Lozenge node={inlineExtensionData[2] as any} />);
    const img = lozenge.find('img');
    expect(img).toHaveLength(1);
    expect(img.props()).toHaveProperty('height', ICON_SIZE);
    expect(img.props()).toHaveProperty('width', ICON_SIZE);
  });

  it("should render PlaceholderFallback if extension doesn't have an image param", () => {
    const lozenge = shallow(<Lozenge node={inlineExtensionData[1] as any} />);
    expect(lozenge.find(PlaceholderFallback)).toHaveLength(1);
  });
});
