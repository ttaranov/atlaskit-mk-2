import { Node as PmNode } from 'prosemirror-model';

export type MacroType = 'extension' | 'inlineExtension';

export interface MacroAdf {
  type: MacroType;
  attrs: {
    extensionKey: string;
    extensionType: string;
    bodyType?: 'none' | 'plain' | 'rich'; // inlineExtension doesn't have this field
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
