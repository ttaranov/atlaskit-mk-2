import * as React from 'react';
import { RendererContext } from '..';
import { renderNodes, Serializer } from '../..';
import { ExtensionHandlers } from '../../ui/Renderer';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  originalContent?: any;
  parameters?: any;
  content?: any;
}

function getRenderNodesHandler(serializer: Serializer<any>, rendererContext: RendererContext) {
  return (extensionContent) => {
    const nodes = Array.isArray(extensionContent)
      ? extensionContent
      : [extensionContent];

    return renderNodes(nodes, serializer, rendererContext.schema, 'div');
  }
}

const BodiedExtension: React.StatelessComponent<Props> = ({
  serializer,
  extensionHandlers,
  rendererContext,
  extensionType,
  extensionKey,
  content,
  parameters,
  children,
}) => {
  try {
    if (extensionHandlers && extensionHandlers[extensionType]) {
      const renderNodesHandler = getRenderNodesHandler(serializer, rendererContext)
      const extensionContent = extensionHandlers[extensionType](
        { extensionKey, parameters, content },
        rendererContext.adDoc,
        renderNodesHandler
      );

      switch (true) {
        case extensionContent && React.isValidElement(extensionContent):
          // Return the extensionContent directly if it's a valid JSX.Element
          return <div>{extensionContent}</div>;
        case !!extensionContent:
          // We expect it to be Atlassian Document here
          return renderNodesHandler(extensionContent);
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

