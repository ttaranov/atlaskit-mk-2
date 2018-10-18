//@flow
import React, { Children, Fragment } from 'react';
import type { Props, State } from './Tooltip';
import { Tooltip as StyledTooltip } from '../styled';

export default class AsyncTooltip extends React.Component<Props, State> {
  static Tooltip = null;
  static defaultProps = {
    component: StyledTooltip,
    delay: 300,
    mousePosition: 'bottom',
    position: 'bottom',
    tag: 'div',
  };

  static preload() {
    return AsyncTooltip.loadTooltip();
  }

  static loadTooltip() {
    return import(/* webpackChunkName:"@atlaskit-internal-tooltip" */ './Tooltip').then(
      module => {
        AsyncTooltip.Tooltip = module.default;
        return AsyncTooltip.Tooltip;
      },
    );
  }

  componentDidMount() {
    if (!AsyncTooltip.Tooltip) {
      AsyncTooltip.loadTooltip().then(() => {
        this.forceUpdate();
      });
    }
  }

  render() {
    if (!AsyncTooltip.Tooltip) {
      return <Fragment>{Children.only(this.props.children)}</Fragment>;
    }

    return <AsyncTooltip.Tooltip {...this.props} />;
  }
}
