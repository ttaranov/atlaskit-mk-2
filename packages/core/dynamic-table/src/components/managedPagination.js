//@flow
import React, { Component, Fragment } from 'react';
import Pagination, { collapseRange } from '@atlaskit/pagination';

type Props = {
  value?: number,
  onChange: Function,
  total: number,
  i18n: {
    next: string,
    prev: string,
  },
};

const MAX_VISIBLE_PAGES = 7;

export default class ManagedPagination extends Component<Props> {
  onChange = (newValue: number) => {
    this.props.onChange(newValue);
  };

  render() {
    const { total, value = 1, i18n } = this.props;
    const items = [...Array(total)].map((_, index) => index + 1);
    const pageLinksCollapsed = collapseRange(MAX_VISIBLE_PAGES, value, items);
    return (
      <Pagination>
        {(LeftNavigator, Page, RightNavigator, Ellipses) => (
          <Fragment>
            <LeftNavigator
              ariaLabel={i18n.prev}
              isDisabled={value === 1}
              onClick={() => this.onChange(value - 1)}
            />
            {pageLinksCollapsed.map((pageNumber, key) => {
              if (pageNumber === '...') {
                //eslint-disable-next-line
                return <Ellipses key={`${pageNumber}-${key}`} />;
              }
              return (
                <Page
                  key={`${pageNumber}`}
                  isSelected={pageNumber === this.props.value}
                  onClick={() => this.onChange(pageNumber)}
                >
                  {pageNumber}
                </Page>
              );
            })}
            <RightNavigator
              ariaLabel={i18n.next}
              isDisabled={value === total}
              onClick={() => this.onChange(value + 1)}
            />
          </Fragment>
        )}
      </Pagination>
    );
  }
}
