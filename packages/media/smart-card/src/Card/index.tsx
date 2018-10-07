import { CardAppearance } from './CardContent';
import { CardProps } from './types';
import {
  isCardWithData,
  renderCardWithData,
  renderCardWithURL,
} from './render';
export { CardAppearance, CardProps };

export const Card = (props: CardProps) =>
  isCardWithData(props) ? renderCardWithData(props) : renderCardWithURL(props);
