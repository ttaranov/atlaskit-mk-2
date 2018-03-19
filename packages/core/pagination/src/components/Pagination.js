// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';

import { type i18nShape, defaultI18n } from '../internal/props';
import { Container, Ellipsis, ButtonActive } from '../styled';
import pageRange from '../internal/page-range';

const MAX_VISIBLE_PAGES = 7;

type Props = {
  /** The current page. Current page value will be controlled */
  current?: number,
  /** The default current page. Current page value will be uncontrolled. */
  defaultCurrent: number,
  /** Object that sets the labels for the previous and next buttons. It should
  have the properties 'prev' and 'next', which should be strings. Defaults to
  'Prev' and 'Next' */
  i18n: i18nShape,
  /** Called when the page is changed. Will be called with the number of the new page. */
  onSetPage: number => void,
  /** The total number of pages in the pagination. */
  total: number,
};

type State = {
  current: number,
};

export default class Pagination extends Component<Props, State> {
  static defaultProps = {
    defaultCurrent: 1,
    i18n: defaultI18n,
    onSetPage: () => {},
    total: 0,
  };

  state = {
    current: this.props.defaultCurrent,
  };

  getCurrent() {
    return this.props.current ? this.props.current : this.state.current;
  }

  onSetPage = (page: number) => {
    if (this.props.current) {
      this.props.onSetPage(page);
    } else {
      this.setState({ current: page });
    }
  };

  render() {
    const { total, i18n } = this.props;
    if (!i18n || !i18n.prev || !i18n.next) {
      throw new Error('Pagination component provided unusable i18nShape');
    }
    const current = this.getCurrent();

    return total === 0 ? null : (
      <Container>
        <Button
          appearance="link"
          isDisabled={current === 1}
          onClick={() => this.onSetPage(current - 1)}
        >
          {i18n.prev}
        </Button>

        {pageRange(MAX_VISIBLE_PAGES, current, total).map(
          (pageNum: '...' | number, i) => {
            const isDisabled = pageNum === current;
            const Element = isDisabled ? ButtonActive : Button;
            const key = `${pageNum}-${i}`;
            return pageNum === '...' ? (
              <Ellipsis key={key}>...</Ellipsis>
            ) : (
              <Element
                isDisabled={isDisabled}
                key={key}
                appearance="link"
                // $FlowFixMe fails to narrow type after ternary
                onClick={() => this.onSetPage(pageNum)}
              >
                {pageNum}
              </Element>
            );
          },
        )}

        <Button
          appearance="link"
          isDisabled={current === total}
          onClick={() => this.onSetPage(current + 1)}
        >
          {i18n.next}
        </Button>
      </Container>
    );
  }
}
