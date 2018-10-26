//@flow
import { Component } from 'react';
import Page from './page';
import { LeftNavigator, RightNavigator } from './navigators';
import Ellipses from './ellipses';

type Props = {
  children: Function,
};

export default class Pagination extends Component<Props> {
  render() {
    const { children } = this.props;
    return children
      ? children(LeftNavigator, Page, RightNavigator, Ellipses)
      : null;
  }
}
