// @flow
import React, { Component } from 'react';
import { RankableTableBodyCell } from '../../styled/rankable/TableCell';
import type { HeadCellType, RowCellType } from '../../types';
import withDimensions, {
  type WithDimensionsProps,
} from '../../hoc/withDimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';

type Props = {
  head: HeadCellType | void,
  cell: RowCellType,
  isFixedSize: boolean,
  isRanking: boolean,
} & WithDimensionsProps;

const stopPropagation = e => e.stopPropagation();

export class RankableTableCell extends Component<Props, {}> {
  render() {
    const {
      cell,
      head,
      isFixedSize,
      isRanking,
      innerRef,
      refWidth,
    } = this.props;
    const { content, ...restCellProps } = cell;
    const { shouldTruncate, width } = head || {};
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);

    return (
      <RankableTableBodyCell
        {...restCellProps}
        isFixedSize={isFixedSize}
        shouldTruncate={shouldTruncate}
        width={width}
        isRanking={isRanking}
        style={inlineStyles}
        innerRef={innerRef}
        onKeyDown={stopPropagation}
      >
        {content}
      </RankableTableBodyCell>
    );
  }
}

export default withDimensions(RankableTableCell);
