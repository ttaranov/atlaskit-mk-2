import * as React from 'react';
import { CardList as CardListType, CardListProps } from './index';

interface AsyncCardListProps {
  CardList?: typeof CardListType;
}

export default class CardList extends React.PureComponent<
  CardListProps & AsyncCardListProps
> {
  static displayName = 'AsyncCardList';
  static CardList?: typeof CardListType;

  state = {
    CardList: CardList.CardList,
  };

  componentWillMount() {
    if (!this.state.CardList) {
      import(/* webpackChunkName:"@atlaskit-internal_CardList" */
      './index').then(module => {
        CardList.CardList = module.CardList;
        this.setState({ CardList: module.CardList });
      });
    }
  }

  render() {
    if (!this.state.CardList) {
      if (this.props.loadingComponent) {
        return this.props.loadingComponent;
      }

      return null;
    }

    return <this.state.CardList {...this.props} />;
  }
}
