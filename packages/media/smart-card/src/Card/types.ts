import { Client } from '../Client';
import { CardAppearance } from './CardContent';

export type CardWithData = {
  appearance: CardAppearance;
  data?: any;
};

export type CardWithUrl = {
  appearance: CardAppearance;
  url?: string;
  client?: Client;
};

export type CardProps = CardWithData | CardWithUrl;
