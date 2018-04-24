import { Node as PmNode } from 'prosemirror-model';
import {
  MacroProvider,
  MacroAttributes,
  ExtensionType,
} from '@atlaskit/editor-core';
import { bodiedExtensionData } from './mock-extension-data';

const allExtensionData = [...bodiedExtensionData];

const getMacroADFNode = (macroName, macroParams): MacroAttributes => {
  return {
    type: 'inlineExtension' as ExtensionType,
    attrs: {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: macroName,
      parameters: {
        macroParams,
        macroMetadata: {
          macroId: { value: new Date().valueOf() },
          placeholder: [
            {
              data: { url: '' },
              type: 'icon',
            },
          ],
        },
      },
    },
  };
};

export class MockMacroProvider implements MacroProvider {
  public config = {};

  openMacroBrowser(macroNode?: PmNode): Promise<MacroAttributes> {
    return Promise.resolve(allExtensionData[0]);
  }

  autoConvert(text: String): Promise<any> {
    const node = (function(link) {
      switch (link) {
        case 'http://www.dumbmacro.com/?paramA=CFE':
          return getMacroADFNode('dumbMacro', {
            paramA: { value: 'CFE' },
          });
        case 'http://www.smartmacro.com/?paramB=CFE':
          return getMacroADFNode('smartMacro', {
            paramB: { value: 'CFE' },
          });
        default:
          return null;
      }
    })(text);
    return new Promise(resolve => setTimeout(() => resolve(node), 2000));
  }
}

export const macroProvider = new MockMacroProvider();
