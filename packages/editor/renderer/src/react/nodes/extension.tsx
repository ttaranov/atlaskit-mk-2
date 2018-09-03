import * as React from 'react';
import { RendererContext, BreakoutConsumer } from '..';
import { renderNodes, Serializer } from '../..';
import {
  ADNode,
  ExtensionHandlers,
  ExtensionLayout,
} from '@atlaskit/editor-common';
import { calcExtensionWidth } from '@atlaskit/editor-common';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  text?: string;
  parameters?: any;
  layout?: ExtensionLayout;
}

export const renderExtension = (content: any, layout: string) => (
  <BreakoutConsumer>
    {containerWidth => (
      <div
        className={`Extension-${layout}`}
        style={{
          width: calcExtensionWidth(layout, containerWidth),
        }}
      >
        {content}
      </div>
    )}
  </BreakoutConsumer>
);

const Extension: React.StatelessComponent<Props> = ({
  serializer,
  extensionHandlers,
  rendererContext,
  extensionType,
  extensionKey,
  text,
  parameters,
  layout = 'default',
}) => {
  try {
    if (extensionHandlers && extensionHandlers[extensionType]) {
      const content = extensionHandlers[extensionType](
        {
          type: 'extension',
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
          return renderExtension(content, layout);
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
  return renderExtension(text || 'extension', layout);
};

export default Extension;
