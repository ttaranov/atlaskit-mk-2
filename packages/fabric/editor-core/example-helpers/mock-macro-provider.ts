import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider, MacroAdf } from '../src/editor/plugins/macro/types';
import { inlineMacroData } from './mock-macro-data';

export class MockMacroProvider implements MacroProvider {
  public config = {
    placeholderBaseUrl: '//pug.jira-dev.com',
  };

  openMacroBrowser(macroNode?: PmNode): Promise<MacroAdf> {
    const index = Math.floor(Math.random() * inlineMacroData.length);
    return Promise.resolve(inlineMacroData[index]);
  }
}

export const macroProvider = new MockMacroProvider();
export const macroProviderPromise = Promise.resolve(macroProvider);
