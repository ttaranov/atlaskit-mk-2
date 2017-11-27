// @flow
import React, { Component } from 'react';
import Pagination from './Stateless';

import { type i18nShape, defaultI18n } from '../internal/props';

type Props = {
  /** Default current page on component mount. Sets internal state. */
  defaultCurrent: number,
  /** Object that sets the values for the previous and next buttons. It should
  have the properties 'prev' and 'next', which should be strings. Defaults to
  'Prev' and 'Next' */
  i18n?: i18nShape,
  /** Function to call on function set. Is called with the number of the page
   new page. */
  onSetPage?: number => mixed,
  /** The number of pages in the pagination. */
  total: number,
  /** Set the current page. Passing this in is not advised as it makes you
   responsible for managing state. */
};

type State = {
  current: number,
};

export default class AkPagination extends Component<Props, State> {
  static defaultProps = {
    defaultCurrent: 1,
    i18n: defaultI18n,
    total: 1,
  };

  state = {
    current: this.props.defaultCurrent,
  };

  onSetPage = (page: number) => {
    if (this.props.onSetPage) this.props.onSetPage(page);
    this.setState({ current: page });
  };

  render() {
    const { i18n, total } = this.props;

    return (
      <Pagination
        i18n={i18n}
        onSetPage={this.onSetPage}
        total={total}
        current={this.state.current}
      />
    );
  }
}
