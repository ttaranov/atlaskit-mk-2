import * as React from 'react';
import { shallow } from 'enzyme';
import { inlineExtensionData } from '@atlaskit/editor-test-helpers';

import Placeholder from '../../src/ui/Extension/Placeholder';
import { PlaceholderFallback } from '../../src/ui/Extension/styles';

describe('@atlaskit/editor-core/ui/Extension/Placeholder', () => {
  const noop: any = () => {};

  it('should render image if extension node has placeholder image param', () => {
    const placeholder = shallow(
      <Placeholder node={inlineExtensionData[0] as any} />,
    );
    expect(placeholder.find('img')).toHaveLength(1);
  });

  it("should render PlaceholderFallback if extension node doesn't have placeholder image param", () => {
    const placeholder = shallow(
      <Placeholder node={inlineExtensionData[1] as any} />,
    );
    expect(placeholder.find(PlaceholderFallback)).toHaveLength(1);
  });
});
