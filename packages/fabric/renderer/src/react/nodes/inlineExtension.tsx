import * as React from 'react';
import { RendererContext } from '..';
import { renderNode, Serializer } from '../..';
import { ExtensionHandlers } from '../../ui/Renderer';
import { Node } from '../../validator';

export interface Props {
  serializer: Serializer<any>;
  extensionHandlers?: ExtensionHandlers;
  rendererContext: RendererContext;
  extensionType: string;
  extensionKey: string;
  parameters?: any;
  adContent?: any;
}

const InlineExtension: React.StatelessComponent<Props> = props => {
  const {
    serializer,
    rendererContext,
    extensionHandlers,
    extensionType,
    extensionKey,
    parameters,
    adContent,
    children,
  } = props;

  if (extensionHandlers && extensionHandlers[extensionType]) {
    const content = extensionHandlers[extensionType](
      { extensionKey, parameters, content: adContent },
      rendererContext.adDoc,
    );

    switch (true) {
      case content && React.isValidElement(content):
        // Return the content directly if it's a valid JSX.Element
        return <div>{content}</div>;
      case !!content:
        // We expect it to be Atlassian Document here
        // We need to wrap the content, because renderNode will start
        // rendering from its content.
        const wrappedContent = {
          type: 'paragraph',
          content: [content],
        };
        const result = renderNode(
          wrappedContent as Node,
          serializer,
          rendererContext.schema,
        );
        if (result) {
          return <span>{result}</span>;
        }
    }
  }

  // Always return default content if anything goes wrong
  return <span>{children}</span>;
};

export default InlineExtension;
