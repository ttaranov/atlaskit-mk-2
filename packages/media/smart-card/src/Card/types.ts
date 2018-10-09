import { Client } from '../Client';
import { CardAppearance } from './CardContent';

export type CardWithData = {
  appearance: CardAppearance;
  data?: any;
  isSelected?: boolean;
};

export type CardWithUrl = {
  appearance: CardAppearance;
  url?: string;
  client?: Client;
  isSelected?: boolean;
};

export type CardProps = CardWithData | CardWithUrl;
