import en from '../../i18n/global-search_en';
import fr from '../../i18n/global-search_fr';
import pt_BR from '../../i18n/global-search_pt_BR';

import { getMessagesForLocale } from '../../i18n';

describe('i18n', () => {
  it('should resolve country[underscore]territory locale', () => {
    const messages = getMessagesForLocale('pt_BR');
    expect(messages).toBe(pt_BR);
  });

  it('should resolve country[dash]territory locale', () => {
    const messages = getMessagesForLocale('pt-BR');
    expect(messages).toBe(pt_BR);
  });

  it('should resolve locale by country if territory cannot be found', () => {
    const messages = getMessagesForLocale('fr_FR');
    expect(messages).toBe(fr);
  });

  it('should fallback to EN if locale cannot be found', () => {
    const messages = getMessagesForLocale('HUG_HUG');
    expect(messages).toBe(en);
  });
});
