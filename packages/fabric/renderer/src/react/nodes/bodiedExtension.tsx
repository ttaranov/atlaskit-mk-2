import * as React from 'react';
import { RendererContext } from '..';
import { renderNodes, Serializer } from '../..';
import { ExtensionHandlers } from '../../ui/Renderer';
import { ADNode } from '@atlaskit/editor-common';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  originalContent?: any;
  parameters?: any;
}

const BodiedExtension: React.StatelessComponent<Props> = ({
  serializer,
  extensionHandlers,
  rendererContext,
  extensionType,
  extensionKey,
  originalContent,
  parameters,
  children,
}) => {
  try {
    if (extensionHandlers && extensionHandlers[extensionType]) {
      const content = extensionHandlers[extensionType](
        { extensionKey, parameters, content: originalContent },
        rendererContext.adDoc,
      );

      switch (true) {
        case content && React.isValidElement(content):
          // Return the content directly if it's a valid JSX.Element
          return <div>{content}</div>;
        case !!content:
          // We expect it to be Atlassian Document here
          const nodes = Array.isArray(content) ? content : [content];
          return renderNodes(
            nodes as ADNode[],
            serializer,
            rendererContext.schema,
            'div',
          );
      }
    }
  } catch (e) {
    /** We don't want this error to block renderer */
    /** We keep rendering the default content */
  }

  // Always return default content if anything goes wrong
  return <div>{children}</div>;
};

export default BodiedExtension;
