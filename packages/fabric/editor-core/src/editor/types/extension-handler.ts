import { ADNode } from '@atlaskit/editor-common';

export interface ExtensionParams<T> {
  extensionKey: string;
  parameters?: T;
  content?: any; // This would be the original Atlassian Document Format
}

export type ExtensionHandler<T> = (
  ext: ExtensionParams<T>,
  doc: any,
) => JSX.Element | ADNode[] | null;

export interface ExtensionHandlers {
  [key: string]: ExtensionHandler<any>;
}
