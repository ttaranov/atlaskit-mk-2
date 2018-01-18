import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider, MacroAttributes } from '@atlaskit/editor-core';
import { inlineExtensionData } from './mock-extension-data';

export class MockMacroProvider implements MacroProvider {
  public config = {};

  openMacroBrowser(macroNode?: PmNode): Promise<MacroAttributes> {
    const index = Math.floor(Math.random() * inlineExtensionData.length);
    return Promise.resolve(inlineExtensionData[index]);
  }
}

export const macroProvider = new MockMacroProvider();
