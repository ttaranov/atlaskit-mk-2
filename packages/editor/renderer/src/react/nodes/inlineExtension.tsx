import * as React from 'react';
import { RendererContext } from '..';
import { renderNodes, Serializer } from '../..';
import { ADNode, ExtensionHandlers } from '@atlaskit/editor-common';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
}

const InlineExtension: React.StatelessComponent<Props> = ({
  serializer,
  extensionHandlers,
  rendererContext,
  extensionType,
  extensionKey,
  parameters,
  text,
  children,
}) => {
  try {
    if (extensionHandlers && extensionHandlers[extensionType]) {
      const content = extensionHandlers[extensionType](
        {
          type: 'inlineExtension',
          extensionKey,
          extensionType,
          parameters,
          content: text,
        },
        rendererContext.adDoc,
      );

      switch (true) {
        case content && React.isValidElement(content):
          // Return the content directly if it's a valid JSX.Element
          return <span>{content}</span>;
        case !!content:
          // We expect it to be Atlassian Document here
          const nodes = Array.isArray(content) ? content : [content];
          return renderNodes(
            nodes as ADNode[],
            serializer,
            rendererContext.schema,
            'span',
          );
      }
    }
  } catch (e) {
    /** We don't want this error to block renderer */
    /** We keep rendering the default content */
  }

  // Always return default content if anything goes wrong
  return <span>{text || 'inlineExtension'}</span>;
};

export default InlineExtension;
