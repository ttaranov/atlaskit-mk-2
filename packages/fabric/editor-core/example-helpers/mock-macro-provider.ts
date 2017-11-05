import { MacroProvider, DisplayType, Macro, MacroParams } from '../src/editor/plugins/macro/types';

export class MockMacroProvider implements MacroProvider {
  public config = {
    placeholderBaseUrl: '//pug.jira-dev.com'
  };

  openMacroBrowser(macroParams?: MacroParams): Promise<Macro> {
    const macroId = `${new Date().valueOf()}`;
    const name = 'status';
    const placeholderUrl = '/wiki/plugins/servlet/confluence/placeholder/macro?definition=e3N0YXR1czpzdWJ0bGU9dHJ1ZXxjb2xvdXI9R3JlZW58dGl0bGU9T0t9&locale=en_GB&version=2';
    const params = '{"color": "yellow", "text": "In progress"}';
    const displayType: DisplayType = 'INLINE';

    return Promise.resolve({
      displayType,
      macroId,
      name,
      params: JSON.parse(params),
      placeholderUrl
    });
  }
}

export const macroProvider = new MockMacroProvider();
export const macroProviderPromise = Promise.resolve(macroProvider);
