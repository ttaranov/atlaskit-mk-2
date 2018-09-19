import * as React from 'react';
import * as Loadable from 'react-loadable';

import { CardLoading } from '../utils/cardLoading';
import {
  CardViewBase as CardViewBaseType,
  CardViewBaseProps,
  CardView as CardViewType,
} from './cardView';

interface AsyncCardViewBase {
  CardViewBase?: typeof CardViewBaseType;
}

/**
 * TODO: MS-699 Remove these loaders when CardView is no longer used externally
 */

export class CardViewBase extends React.PureComponent<
  CardViewBaseProps & AsyncCardViewBase
> {
  static CardViewBase?: typeof CardViewBaseType;

  state = {
    CardViewBase: CardViewBase.CardViewBase,
  };

  componentWillMount() {
    if (!this.state.CardViewBase) {
      import(/* webpackChunkName:"@atlaskit-internal_CardViewBase" */
      './cardView').then(module => module.CardViewBase);
    }
  }

  render() {
    if (!this.state.CardViewBase) {
      return <CardLoading mediaItemType={this.props.mediaItemType} />;
    }

    return <this.state.CardViewBase {...this.props} />;
  }
}

export const CardView = (Loadable as any)({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_CardView" */
    './cardView').then(module => module.CardView),
  loading: () => <CardLoading />,
}) as typeof CardViewType;

// export const CardView = CardLoading;

export const CardViewWithAnalyticsEvents = (Loadable as any)({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_CardViewWithAnalyticsEvents" */
    './cardView').then(module => module.CardViewWithAnalyticsEvents),
  loading: () => <CardLoading />,
});
