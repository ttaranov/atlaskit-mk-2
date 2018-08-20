import { pluginKey } from './main';
import { CardAppearance, CardProvider, CardPluginAction } from '../types';
import { Transaction } from 'prosemirror-state';

export const cardAction = (tr, action: CardPluginAction): Transaction => {
  return tr.setMeta(pluginKey, action);
};

export const resolveCard = url => (tr: Transaction) =>
  cardAction(tr, {
    type: 'RESOLVE',
    url,
  });

export const queueCard = (
  url: string,
  pos: number,
  appearance: CardAppearance,
) => (tr: Transaction) =>
  cardAction(tr, {
    type: 'QUEUE',
    url,
    pos,
    appearance,
  });

export const setProvider = (cardProvider: CardProvider | null) => (
  tr: Transaction,
) =>
  cardAction(tr, {
    type: 'SET_PROVIDER',
    provider: cardProvider,
  });
