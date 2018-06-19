import * as React from 'react';

// tslint:disable-next-line:variable-name
const TableRow = props => {
  const isHeader = props.content &&
    props.content.length > 0 &&
    props.content[0].type === 'tableHeader';
  return (
    <tr>
      {props.isNumberColumnEnabled &&
        (isHeader ?
        <th className="numbered-cell" data-is-number-cell={true}><p>{props.index > 0 ? props.index: ''}</p></th>:
        <td className="numbered-cell" data-is-number-cell={true}><p>{props.index > 0 ? props.index: ''}</p></td>)
      }
      {props.children}
    </tr>
  )
};
export default TableRow;
