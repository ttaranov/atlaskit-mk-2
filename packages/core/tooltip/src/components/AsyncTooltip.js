import React, { Children, Fragment } from 'react';

export default class AsyncTooltip extends React.PureComponent {
  static Tooltip = null;

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
