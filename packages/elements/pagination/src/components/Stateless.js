// @flow
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import { defaultI18n, type i18nShape } from '../internal/props';
import { Container, ButtonActive, Ellipsis } from '../styled/index';

const MAX_VISIBLE_PAGES = 7;

const range = (start, length) => [...Array(length)].map((_, i) => start + i);

/**
 * Returns an array that represents how the pagination should appear. This
 * array will contain page numbers and ellipsis. For example:
 *
 * pageRange(7, 5, 100) = [1, '...', 4, 5, 6, '...', 100]
 *
 * This method will throw an exception if visible is less than 7. With less
 * than 7 visible pages it can become impossible to navigate the range.
 */
export const pageRange = (
  visible: number,
  current: number,
  total: number,
): Array<number | '...'> => {
  if (visible < 7) {
    throw new Error('cannot create range with visible pages less than 7');
  }
  // only need ellipsis if we have more pages than we can display
  const needEllipsis = total > visible;
  // show start ellipsis if the current page is further away than max - 3 from the first page
  const hasStartEllipsis = needEllipsis && visible - 3 < current;
  // show end ellipsis if the current page is further than total - max + 3 from the last page
  const hasEndEllipsis = needEllipsis && current < total - visible + 4;
  if (!needEllipsis) {
    return range(1, total);
  } else if (hasStartEllipsis && !hasEndEllipsis) {
    const pageCount = visible - 2;
    return [1, '...', ...range(total - pageCount + 1, pageCount)];
  } else if (!hasStartEllipsis && hasEndEllipsis) {
    const pageCount = visible - 2;
    return [...range(1, pageCount), '...', total];
  }
  // we have both start and end ellipsis
  const pageCount = visible - 4;
  return [
    1,
    '...',
    ...range(current - Math.floor(pageCount / 2), pageCount),
    '...',
    total,
  ];
};

// current, total

type Props = {
  /** The page that is currently selected. */
  current: number,
  /** Object that sets the values for the previous and next buttons. It should
  have the properties 'prev' and 'next', which should be strings. Defaults to
  'Prev' and 'Next' */
  i18n?: i18nShape,
  /** Function to call when the page is changed. It is called with the number
   of the page clicked on. */
  onSetPage?: number => mixed,
  /** The number of pages to display. */
  total: number,
};

export class PaginationStateless extends Component<Props, {}> {
  static defaultProps = {
    current: 1,
    i18n: defaultI18n,
    onSetPage: () => {},
    total: 1,
  };

  onSetPage = (page: number) => () => {
    return this.props.onSetPage ? this.props.onSetPage(page) : () => {};
  };

  render() {
    const { total, current, i18n } = this.props;
    if (!i18n || !i18n.prev || !i18n.next || typeof current !== 'number') {
      throw new Error('Pagination component provided unusable i18nShape');
    }
    const prevLabel = i18n.prev;
    const prevIsDisabled = current === 1;
    const prevOnClick = this.onSetPage(current - 1);

    const nextLabel = i18n.next;
    const nextIsDisabled = current === total;
    const nextOnClick = this.onSetPage(current + 1);

    return !total ? null : (
      <Container>
        <Button
          appearance="link"
          isDisabled={prevIsDisabled}
          onClick={prevOnClick}
        >
          {prevLabel}
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
                onClick={this.onSetPage(pageNum)}
              >
                {pageNum}
              </Element>
            );
          },
        )}

        <Button
          appearance="link"
          isDisabled={nextIsDisabled}
          onClick={nextOnClick}
        >
          {nextLabel}
        </Button>
      </Container>
    );
  }
}

export default withAnalyticsContext({
  component: 'pagination',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onSetPage: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'change',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },
  })(PaginationStateless),
);
