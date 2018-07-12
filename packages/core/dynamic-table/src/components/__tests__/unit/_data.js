// @flow

export const sortKey = 'first_name';
export const secondSortKey = 'last_name';

export const head = {
  cells: [
    {
      key: sortKey,
      content: 'First name',
      isSortable: true,
    },
    {
      key: secondSortKey,
      content: 'Last name',
    },
  ],
};

export const rows = [
  {
    cells: [
      {
        key: 'baob',
        content: 'Barack',
      },
      {
        content: 'Obama',
      },
    ],
  },
  {
    cells: [
      {
        key: 'dotr',
        content: 'Donald',
      },
      {
        content: 'Trump',
      },
    ],
  },
  {
    cells: [
      {
        key: 'hicl',
        content: 'Hillary',
      },
      {
        content: 'Clinton',
      },
    ],
  },
  {
    cells: [
      {
        key: 'tjeff',
        content: 'Thomas',
      },
      {
        content: 'Jefferson',
      },
    ],
  },
];

export const row = rows[0];

export const rowsWithKeys: Array<Object> = rows.map((tRow, rowIndex) => {
  return {
    key: `${rowIndex}`,
    ...tRow,
  };
});

export const rowWithKey = rowsWithKeys[0];

export const cellWithKey = rowWithKey.cells[0];
