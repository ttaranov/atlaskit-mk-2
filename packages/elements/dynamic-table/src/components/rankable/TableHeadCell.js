// @flow
import React, { Component } from 'react';
import withDimensions, {type WithDimensionsProps} from '../../hoc/withDimensions';
import HeadCell, {type Props as HeadCellProps} from "../TableHeadCell";

type Props = {
  isRanking: boolean,
} & WithDimensionsProps & HeadCellProps;

class RankableTableHeadCell extends Component<Props, {}> {

  render() {
    const { isRanking, refHeight, refWidth, innerRef, ...restProps} = this.props;

    const inlineStyles = isRanking ? {width: refWidth} : {};

    return (
      <HeadCell
        inlineStyles={inlineStyles}
        innerRef={innerRef}
        {...restProps}
      />
    );
  }
}

export default withDimensions(RankableTableHeadCell);
