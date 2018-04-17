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
  originalContent?: any;
  parameters?: any;
  content?: any;
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
      const extensionContent = extensionHandlers[extensionType](
        {
          type: 'bodiedExtension',
          extensionKey,
          extensionType,
          parameters,
          content,
        },
        rendererContext.adDoc,
      );

      switch (true) {
        case extensionContent && React.isValidElement(extensionContent):
          // Return the extensionContent directly if it's a valid JSX.Element
          return <div>{extensionContent}</div>;
        case !!extensionContent:
          // We expect it to be Atlassian Document here
          const nodes = Array.isArray(extensionContent)
            ? extensionContent
            : [extensionContent];
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
