export type DisplayType = 'INLINE' | 'BLOCK';

export type BodyType = 'BODYLESS' | 'RICH-TEXT-BODY' | 'PLAIN-TEXT-BODY';

export type MacroType = 'BODYLESS-INLINE' | 'BODYLESS-BLOCK' | 'RICH-TEXT-BODY-BLOCK' | 'PLAIN-TEXT-BODY-BLOCK';

export interface Macro {
  macroId: string;
  name: string;
  placeholderUrl: string;
  params: any; // (all "<ac:parameter>")
  displayType: DisplayType;
  plainTextBody?: string;
  richTextBody?: any; // could have nested macros
}

export interface MacroParams {
  macroId: string;
  params: any;
}

export interface MacroConfig {
  placeholderBaseUrl: string;
}

export interface MacroProvider {
  config: MacroConfig;
  /**
   * If "macro" param is passed in, it will open macro browser for editing the macro
   */
  openMacroBrowser(macroParams?: MacroParams): Promise<Macro>;
}
