import { DisplayType, BodyType, MacroType } from './types';

export const getMacroType = (displayType: DisplayType, plainTextBody?: string, richTextBody?: any): MacroType => {
  let bodyType: BodyType = 'BODYLESS';

  if (richTextBody) {
    bodyType = 'RICH-TEXT-BODY';
  } else if (plainTextBody) {
    bodyType = 'PLAIN-TEXT-BODY';
  }

  return `${bodyType}-${displayType}` as MacroType;
};
