import { MacroType } from '../../editor/plugins/macro/types';

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
