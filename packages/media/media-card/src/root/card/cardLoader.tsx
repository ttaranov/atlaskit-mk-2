import * as React from 'react';
import { CardLoading } from '../../utils/cardLoading';
import { Card as CardType, CardProps } from './index';

interface AsyncCardProps {
  Card?: typeof CardType;
}

export default class Card extends React.PureComponent<
  CardProps & AsyncCardProps
> {
  static displayName = 'AsyncCard';
  static Card?: typeof CardType;

  state = {
    Card: Card.Card,
  };

  componentWillMount() {
    import(/* webpackChunkName:"@atlaskit-internal_Card" */
    './index').then(module => {
      Card.Card = module.Card;
      this.setState({ Card: module.Card });
    });
  }

  render() {
    if (!this.state.Card) {
      return (
        <CardLoading mediaItemType={this.props.identifier.mediaItemType} />
      );
    }

    return <this.state.Card {...this.props} />;
  }
}
