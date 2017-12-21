// @flow

import React from 'react';
// import RankableTable from '../src/components/RankableTableDisplayTable';
import RankableTable from '../src/components/RankableTable';
import RankableTableRow from '../src/components/TableRow';
import RankableTableCell from '../src/components/TableCell';





export default () => <RankableTable>
  <RankableTableRow>
    <RankableTableCell>One one</RankableTableCell>
    <RankableTableCell>Two one</RankableTableCell>
    <RankableTableCell>Three one {'data '.repeat(100)}</RankableTableCell>
  </RankableTableRow>

  <RankableTableRow>
    <RankableTableCell>One two</RankableTableCell>
    <RankableTableCell>Two two</RankableTableCell>
    <RankableTableCell>Three two</RankableTableCell>
  </RankableTableRow>

  <RankableTableRow>
    <RankableTableCell>One three</RankableTableCell>
    <RankableTableCell>Two three</RankableTableCell>
    <RankableTableCell>Three three</RankableTableCell>
  </RankableTableRow>

</RankableTable>;
