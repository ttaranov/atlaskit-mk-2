export type DisplayType = 'INLINE' | 'BLOCK';

export type BodyType = 'BODYLESS' | 'RICH-TEXT-BODY' | 'PLAIN-TEXT-BODY';

export type MacroType =
  | 'BODYLESS-INLINE'
  | 'BODYLESS-BLOCK'
  | 'RICH-TEXT-BODY-BLOCK'
  | 'PLAIN-TEXT-BODY-BLOCK';

export interface MacroProperties {
  'fab:display-type'?: string;
  'fab:placeholder-url'?: string;
  'ac:rich-text-body'?: string;
  'ac:plain-text-body'?: string;
}

export interface Macro {
  macroId: string;
  macroName: string;
  macroType: MacroType;
  properties: MacroProperties;
  params: any;
}
