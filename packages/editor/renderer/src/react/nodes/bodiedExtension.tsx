import * as React from 'react';
import { RendererContext } from '..';
import { renderNodes, Serializer } from '../..';
import { ADNode, ExtensionHandlers } from '@atlaskit/editor-common';
import { renderExtension } from './extension';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  originalContent?: any;
  parameters?: any;
  content?: any;
  layout?: string;
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
  layout = 'default',
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
        case !!parameters.tabsContent:
          // doing what it takes to win the shipit :lol:
          const tabStyles = {
            border: '1px solid #DFE1E6',
            padding: '10px',
            borderRadius: 5,
            marginTop: '10px',
          };
          const wrappedNodes = parameters.tabsContent.map(tab => (
            <div style={tabStyles} data-tabId={tab.tabId} hidden>
              {renderNodes(
                tab.content,
                serializer,
                rendererContext.schema,
                'div',
              )}
            </div>
          ));
          // Return the extensionContent directly if it's a valid JSX.Element
          return (
            <div>
              {renderExtension(extensionContent, layout)}
              {wrappedNodes}
            </div>
          );
        case extensionContent && React.isValidElement(extensionContent):
          // Return the extensionContent directly if it's a valid JSX.Element
          return renderExtension(extensionContent, layout);
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
  return renderExtension(children, layout);
};

export default BodiedExtension;
