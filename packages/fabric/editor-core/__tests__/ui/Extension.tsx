import * as React from 'react';
import { mount } from 'enzyme';
import ProviderFactory from '../../src/providerFactory';
import Extension from '../../src/ui/Extension';
import ExtensionComponent from '../../src/ui/Extension/ExtensionComponent';
import { macroProviderPromise } from '../../example-helpers/mock-macro-provider';
import { inlineMacroData } from '../../example-helpers/mock-macro-data';

describe('@atlaskit/editor-core/ui/Extension', () => {
  const node = inlineMacroData[0] as any;
  const noop: any = () => {};

  it('should render macro component', () => {
    const extension = mount(
      <Extension
        editorView={{} as any}
        node={node}
        handleContentDOMRef={noop}
      />,
    );
    const component = extension.find(ExtensionComponent);

    expect(component.prop('node')).toEqual(node);
    extension.unmount();
  });

  it('should pass macroProvider into MacroComponent', () => {
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('macroProvider', macroProviderPromise);

    const extension = mount(
      <Extension
        editorView={{} as any}
        node={node}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
      />,
    );
    const component = extension.find(ExtensionComponent);

    expect(component.prop('macroProvider')).toBe(macroProviderPromise);
    extension.unmount();
  });
});
