import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider, MacroAttributes } from '@atlaskit/editor-core';
import { bodiedExtensionData } from './mock-extension-data';

export class MockMacroProvider implements MacroProvider {
  public config = {};

  openMacroBrowser(macroNode?: PmNode): Promise<MacroAttributes> {
    const index = Math.floor(Math.random() * bodiedExtensionData.length);
    return Promise.resolve(bodiedExtensionData[index]);
  }
}

export const macroProvider = new MockMacroProvider();
