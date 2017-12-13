import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Extension from '../../../../src/react/nodes/extension';
import {
  ExtensionHandlers,
  ExtensionHandler,
} from '../../../../src/ui/Renderer';
import { RendererContext } from '../../../../src/react';
import ReactSerializer from '../../../../src/react';
import { defaultSchema } from '@atlaskit/editor-common';

describe('Renderer - React/Nodes/Extension', () => {
  const extensionHandlers: ExtensionHandlers = {
    'com.atlassian.fabric': (param: any, doc: any) => {
      switch (param.extensionKey) {
        case 'react':
          return <p>This is a react element</p>;
        case 'adf':
          return [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is a ADF node',
                },
              ],
            },
          ];
        case 'error':
          throw new Error('Tong is cursing you...');
        default:
          return null;
      }
    },
  };

  const rendererContext: RendererContext = {
    objectAri: '123',
    containerAri: '321',
    adDoc: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Check out this extension',
            },
          ],
        },
        {
          type: 'extension',
          attrs: {
            extensionType: 'com.atlassian.stride',
            extensionKey: 'default',
            bodyType: 'rich',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is the default content of the extension',
                },
              ],
            },
          ],
        },
      ],
    },
    schema: defaultSchema,
  };

  const serializer = new ReactSerializer({});

  it('should be able to fall back to default content', () => {
    const extension = mount(
      <Extension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="default"
        text="This is the default text"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).to.equal('This is the default text');
    extension.unmount();
  });

  it('should be able to render React.Element from extensionHandler', () => {
    const extension = mount(
      <Extension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).to.equal('This is a react element');
    extension.unmount();
  });

  it('should be able to render Atlassian Document from extensionHandler', () => {
    const extension = mount(
      <Extension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="adf"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).to.equal('This is a ADF node');
    extension.unmount();
  });

  it('should render the default content if extensionHandler throws an exception', () => {
    const extension = mount(
      <Extension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="error"
      />,
    );

    expect(
      extension
        .find('div')
        .first()
        .text(),
    ).to.equal('extension');
    extension.unmount();
  });
});
