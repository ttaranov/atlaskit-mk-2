import { Node as PmNode } from 'prosemirror-model';

export type ExtensionType = 'extension' | 'bodiedExtension' | 'inlineExtension';

export interface ExtensionAttributes {
  type: ExtensionType;
  attrs: {
    extensionKey: string;
    extensionType: string;
    parameters?: {
      [key: string]: object;
    };
    text?: string; // fallback text
  };
  content?: any; // only bodiedExtension has content
}

export interface ExtensionProvider {
  config: {};
  /**
   * If "macro" param is passed in, it will open macro browser for editing the macro
   */
  openMacroBrowser(macroNode?: PmNode): Promise<ExtensionAttributes>;

  autoConvert(link: String): ExtensionAttributes | null;
}
