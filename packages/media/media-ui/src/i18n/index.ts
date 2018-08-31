import en from './messages_en';
import es from './messages_es';

const localesMessagesMap: { [key: string]: Object } = {
  en,
  es,
};

export const defaultMessages = en;

export const getMessagesForLocale = (
  locale: string = 'en',
): { [key: string]: any } => {
  return localesMessagesMap[locale];
};
