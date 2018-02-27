import * as React from 'react';
import { mount } from 'enzyme';
import { ProviderFactory } from '@atlaskit/editor-common';
import { macroProvider, extensionData } from '@atlaskit/editor-test-helpers';

import Extension from '../../src/ui/Extension';
import ExtensionComponent from '../../src/ui/Extension/ExtensionComponent';

const macroProviderPromise = Promise.resolve(macroProvider);

describe('@atlaskit/editor-core/ui/Extension', () => {
  const node = extensionData[0] as any;
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

  it('should pass props into ExtensionComponent', () => {
    const providerFactory = ProviderFactory.create({
      macroProvider: macroProviderPromise,
    });
    const el = document.createElement('div');

    const extension = mount(
      <Extension
        editorView={{} as any}
        node={node}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
        element={el}
        isSelected
      />,
    );
    const component = extension.find(ExtensionComponent);

    expect(component.prop('macroProvider')).toBe(macroProviderPromise);
    expect(component.prop('element')).toBe(el);
    expect(component.prop('isSelected')).toBe(true);
    extension.unmount();
  });
});
