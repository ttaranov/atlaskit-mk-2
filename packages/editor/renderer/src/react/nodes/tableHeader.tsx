import * as React from 'react';

// tslint:disable-next-line:variable-name
const TableHeader = props => {
  let style = {};

  if (props.background) {
    style['background-color'] = props.background;
  }

  return (
    <th style={style} rowSpan={props.rowspan} colSpan={props.colspan}>
      {props.children}
    </th>
  );
};

export default TableHeader;
