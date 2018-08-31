import en from './messages_en';
import es from './messages_es';

const localesMessagesMap: any = {
  en,
  es,
};

export const getMessagesForLocale = (
  locale: string = 'en',
): { [key: string]: any } => {
  return localesMessagesMap[locale];
};
