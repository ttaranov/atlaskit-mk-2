import * as React from 'react';
import { mount } from 'enzyme';
import { ProviderFactory } from '@atlaskit/editor-common';
import { macroProvider, extensionData } from '@atlaskit/editor-test-helpers';

import Extension from '../../../../../plugins/extension/ui/Extension';
import ExtensionComponent from '../../../../../plugins/extension/ui/Extension/ExtensionComponent';

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
        extensionHandlers={{}}
      />,
    );
    const component = extension.find(ExtensionComponent);

    expect(component.prop('node')).toEqual(node);
    extension.unmount();
  });

  it('should pass macroProvider into ExtensionComponent', () => {
    const providerFactory = ProviderFactory.create({
      macroProvider: macroProviderPromise,
    });

    const extension = mount(
      <Extension
        editorView={{} as any}
        node={node}
        providerFactory={providerFactory}
        handleContentDOMRef={noop}
        extensionHandlers={{}}
      />,
    );
    const component = extension.find(ExtensionComponent);

    expect(component.prop('macroProvider')).toBe(macroProviderPromise);
    extension.unmount();
  });

  it('should render from the extension handler when possible', () => {
    const GalleryComponent = () => <div>Gallery Extension</div>;

    const extensionHandlers = {
      'com.atlassian.confluence.macro.core': (ext, doc) => {
        if (ext.extensionKey === 'gallery') {
          return <GalleryComponent />;
        }

        return null;
      },
    };

    // PM node has extension as type.name instead of just type
    const extensionNode = {
      ...node,
      type: {
        name: 'extension',
      },
    };

    const extension = mount(
      <Extension
        editorView={
          {
            state: {
              doc: {},
            },
          } as any
        }
        node={extensionNode}
        handleContentDOMRef={noop}
        extensionHandlers={extensionHandlers}
      />,
    );

    const component = extension.find(ExtensionComponent);
    expect(component.find('GalleryComponent').length).toBe(1);
  });

  it('should fail silently if extension handler throws', () => {
    const invalidExtensions = () => {
      throw new Error('invalid extension');
    };
    const extensionHandlers = {
      'com.atlassian.confluence.macro.core': (ext, doc) => {
        if (ext.extensionKey === 'gallery') {
          expect(invalidExtensions).toThrow('invalid extension');
        }

        return null;
      },
    };

    // PM node has extension as type.name instead of just type
    const extensionNode = {
      ...node,
      type: {
        name: 'extension',
      },
    };

    const extension = mount(
      <Extension
        editorView={
          {
            state: {
              doc: {},
            },
          } as any
        }
        node={extensionNode}
        handleContentDOMRef={noop}
        extensionHandlers={extensionHandlers}
      />,
    );

    const component = extension.find(ExtensionComponent);
    expect(component.length).toBe(1);
    expect(component.find('GalleryComponent').length).toBe(0);
  });
});
