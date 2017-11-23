import * as React from 'react';
import { shallow } from 'enzyme';
import InlineMacro from '../../src/ui/Macro/InlineMacro';
import { macroProvider } from '../../example-helpers/mock-macro-provider';
import { inlineMacroData } from '../../example-helpers/mock-macro-data';
import { Placeholder, PlaceholderFallback } from '../../src/ui/Macro/styles';

describe('@atlaskit/editor-core/ui/Macro/InlineMacro', () => {
  const noop: any = () => {};

  it('should render Placeholder if inlineExtension has placeholder image param', () => {
    const macro = shallow(<InlineMacro node={inlineMacroData[0] as any} macroProvider={macroProvider} onClick={noop} getPlaceholderUrl={noop} getMacroId={noop} />);
    expect(macro.find(Placeholder)).toHaveLength(1)
  });

  it('should render PlaceholderFallback if inlineExtension doesn\'t have placeholder image param', () => {
    const macro = shallow(<InlineMacro node={inlineMacroData[1] as any} macroProvider={macroProvider} onClick={noop} getPlaceholderUrl={noop} getMacroId={noop} />);
    expect(macro.find(PlaceholderFallback)).toHaveLength(1);
  });
});
