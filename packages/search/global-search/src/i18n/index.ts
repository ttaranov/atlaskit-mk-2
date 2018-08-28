import cs from './global-search_cs';
import da from './global-search_da';
import de from './global-search_de';
import en from './global-search_en';
import es from './global-search_es';
import fi from './global-search_fi';
import fr from './global-search_fr';
import hu from './global-search_hu';
import is from './global-search_is';
import it from './global-search_it';
import ja from './global-search_ja';
import ko from './global-search_ko';
import nb from './global-search_nb';
import nl from './global-search_nl';
import pl from './global-search_pl';
import pt_BR from './global-search_pt_BR';
import pt_PT from './global-search_pt_PT';
import ro from './global-search_ro';
import sk from './global-search_sk';
import sv from './global-search_sv';
import zh from './global-search_zh';

const localesMessagesMap = {
  cs,
  da,
  de,
  en,
  es,
  fi,
  fr,
  hu,
  is,
  it,
  ja,
  ko,
  nb,
  nl,
  pl,
  pt_BR,
  'pt-BR': pt_BR, // should resolve pt-BR and pt_BR
  pt_PT,
  'pt-PT': pt_PT,
  ro,
  sk,
  sv,
  zh,
};

/**
 * Tries to get the most specific messages bundle for a given locale.
 *
 * Strategy:
 * 1. Try to find messages with the exact string (i.e. 'fr_FR')
 * 2. If that doesn't work, try to find messages for the country locale (i.e. 'fr')
 * 3. If that doesn't work, return english messages as a fallback.
 *
 * @param locale string specifying the locale like 'en_GB', or 'fr'.
 */
export const getMessagesForLocale = (locale: string) => {
  let messages = localesMessagesMap[locale];

  if (!messages) {
    const parentLocale = locale.split(/[-_]/)[0];
    messages = localesMessagesMap[parentLocale];
  }

  if (!messages) {
    messages = en;
  }

  return messages;
};
