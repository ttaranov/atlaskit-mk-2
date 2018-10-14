import { Client } from '../Client';
import { CardAppearance } from './CardContent';

type BaseCardProps = {
  appearance: CardAppearance;
  isSelected?: boolean;
  onClick?: () => void;
};

export type CardWithData = BaseCardProps & {
  data?: any;
};

export type CardWithUrl = BaseCardProps & {
  url?: string;
  client?: Client;
};

export type CardProps = CardWithData | CardWithUrl;
