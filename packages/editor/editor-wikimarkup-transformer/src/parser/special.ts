import { MacroName } from '../interfaces';

export function isSpecialMacro(macro: MacroName): boolean {
  return macro === 'code' || macro === 'noformat';
}
