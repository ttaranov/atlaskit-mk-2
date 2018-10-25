// @flow

import { Component } from 'react';
import { withNavigationViewController } from '../../../../src';

class ViewRegistrarBase extends Component<{
  navigationViewController: *,
  view: *,
}> {
  componentDidMount() {
    const { navigationViewController, view } = this.props;
    if (!navigationViewController.views[view.id]) {
      navigationViewController.addView(view);
    }
  }

  render() {
    return null;
  }
}

export const ViewRegistrar = withNavigationViewController(ViewRegistrarBase);
