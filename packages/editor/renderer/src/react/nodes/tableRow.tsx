import * as React from 'react';
import { RendererCssClassName } from '../../consts';

// tslint:disable-next-line:variable-name
const TableRow = props => {
  return (
    <tr>
      {props.isNumberColumnEnabled && (
        <td className={RendererCssClassName.NUMBER_COLUMN}>{props.index}</td>
      )}
      {props.children}
    </tr>
  );
};
export default TableRow;
