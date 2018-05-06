// @flow
import React from 'react';
import TableTree, { Rows, Row, Cell } from '../src';
import staticData from './data-cleancode-toc.json';

export default () => (
  <TableTree>
    <Rows
      rootItems={staticData.children}
      render={({ title, numbering, page, children }) => (
        <Row
          childItems={children}
          itemId={numbering}
          hasChildren={children.length > 0}
        >
          <Cell width={300} singleLine>
            {title}
          </Cell>
          <Cell width={50}>{page}</Cell>
        </Row>
      )}
    />
  </TableTree>
);
