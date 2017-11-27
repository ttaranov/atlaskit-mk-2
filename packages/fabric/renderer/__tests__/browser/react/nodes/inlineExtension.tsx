import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import InlineExtension from '../../../../src/react/nodes/inlineExtension';
import {
  ExtensionHandlers,
  ExtensionHandler,
} from '../../../../src/ui/Renderer';
import { RendererContext } from '../../../../src/react';
import ReactSerializer from '../../../../src/react';
import { defaultSchema } from '@atlaskit/editor-common';

describe('Renderer - React/Nodes/InlineExtension', () => {
  const extensionHandlers: ExtensionHandlers = {
    'com.atlassian.fabric': (param: any, doc: any) => {
      switch (param.extensionKey) {
        case 'react':
          return <span>This is a react element</span>;
        case 'adf':
          return [
            {
              type: 'text',
              text: 'This is a ADF node',
            },
          ];
        case 'error':
          throw new Error('Cursed by Tong');
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
          type: 'inlineExtension',
          attrs: {
            extensionType: 'com.atlassian.stride',
            extensionKey: 'default',
            bodyType: 'none',
          },
          content: [
            {
              type: 'text',
              text: 'This is the default content of the extension',
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
      <InlineExtension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="default"
      >
        <span>This is the default content of the extension</span>
      </InlineExtension>,
    );

    expect(
      extension
        .find('span')
        .first()
        .text(),
    ).to.equal('This is the default content of the extension');
  });

  it('should be able to render React.Element from extensionHandler', () => {
    const extension = mount(
      <InlineExtension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="react"
      />,
    );

    expect(
      extension
        .find('span')
        .first()
        .text(),
    ).to.equal('This is a react element');
  });

  it('should be able to render Atlassian Document from extensionHandler', () => {
    const extension = mount(
      <InlineExtension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="adf"
      />,
    );

    expect(
      extension
        .find('span')
        .first()
        .text(),
    ).to.equal('This is a ADF node');
  });

  it('should render the default content if extensionHandler throws an exception', () => {
    const extension = mount(
      <InlineExtension
        serializer={serializer}
        extensionHandlers={extensionHandlers}
        rendererContext={rendererContext}
        extensionType="com.atlassian.fabric"
        extensionKey="error"
      >
        <span>This is the default content of the extension</span>
      </InlineExtension>,
    );

    expect(
      extension
        .find('span')
        .first()
        .text(),
    ).to.equal('This is the default content of the extension');
  });
});
