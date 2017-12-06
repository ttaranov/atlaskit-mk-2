import { Node as PmNode } from 'prosemirror-model';

export type ExtensionType = 'extension' | 'inlineExtension';
export type ExtensionBodyType = 'none' | 'plain' | 'rich';

export interface MacroAdf {
  type: ExtensionType;
  attrs: {
    extensionKey: string;
    extensionType: string;
    bodyType?: ExtensionBodyType; // inlineExtension doesn't have this field
    parameters?: {
      macroParams?: object;
      macroMetadata?: object;
    };
    text?: string; // fallback text
  };
  content?: any; // inlineExtension doesn't have any content
}

export interface MacroProvider {
  config: {
    placeholderBaseUrl: string;
  };
  /**
   * If "macro" param is passed in, it will open macro browser for editing the macro
   */
  openMacroBrowser(macroNode?: PmNode): Promise<MacroAdf>;
}
