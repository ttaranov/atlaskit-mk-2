import * as React from 'react';
import { shallow } from 'enzyme';
import {
  macroProvider,
  inlineExtensionData,
} from '@atlaskit/editor-test-helpers';

import InlineExtension from '../../src/ui/Extension/InlineExtension';
import { PlaceholderFallback } from '../../src/ui/Extension/styles';

describe('@atlaskit/editor-core/ui/Macro/InlineExtension', () => {
  const noop: any = () => {};

  it('should render Placeholder if inlineExtension has placeholder image param', () => {
    const macro = shallow(
      <InlineExtension
        node={inlineExtensionData[0] as any}
        macroProvider={macroProvider}
        onClick={noop}
      />,
    );
    expect(macro.find('img')).toHaveLength(1);
  });

  it("should render PlaceholderFallback if inlineExtension doesn't have placeholder image param", () => {
    const macro = shallow(
      <InlineExtension
        node={inlineExtensionData[1] as any}
        macroProvider={macroProvider}
        onClick={noop}
      />,
    );
    expect(macro.find(PlaceholderFallback)).toHaveLength(1);
  });
});
