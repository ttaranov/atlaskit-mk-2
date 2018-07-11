import enMessages from './en';
import esMessages from './es';

const localesMessagesMap = { en: enMessages, es: esMessages };

// TODO do we have messages for each locale ('en-GB') or each parentLocale? ('en')?
export const getMessagesForLocale = (locale: string) => {
  const parentLocale = locale.split('-')[0];
  return localesMessagesMap[parentLocale] || enMessages;
};
