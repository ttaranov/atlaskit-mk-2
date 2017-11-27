import * as React from 'react';
import { mount } from 'enzyme';
import ProviderFactory from '../../src/providerFactory';
import Macro from '../../src/ui/Macro';
import MacroComponent from '../../src/ui/Macro/MacroComponent';
import { macroProviderPromise } from '../../example-helpers/mock-macro-provider';
import { inlineMacroData } from '../../example-helpers/mock-macro-data';

describe('@atlaskit/editor-core/ui/Macro', () => {
  const node = inlineMacroData[0] as any;

  it('should render macro component', () => {
    const macro = mount(<Macro editorView={{} as any} node={node} />);
    const macroComponent = macro.find(MacroComponent);
    expect(macroComponent.prop('node')).toEqual(node);
    macro.unmount();
  });

  it('should pass macroProvider into MacroComponent', () => {
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('macroProvider', macroProviderPromise);

    const macro = mount(
      <Macro
        editorView={{} as any}
        node={node}
        providerFactory={providerFactory}
      />,
    );
    const macroComponent = macro.find(MacroComponent);

    expect(macroComponent.prop('macroProvider')).toBe(macroProviderPromise);
    macro.unmount();
  });
});
