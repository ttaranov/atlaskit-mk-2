export default {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Date' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'date', attrs: { timestamp: '1525916281726' } },
        { type: 'text', text: ' ' },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Attendees' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'mention',
          attrs: {
            id: '0',
            text: '@Carolyn',
            accessLevel: '',
          },
        },
        { type: 'text', text: ' ' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'mention',
          attrs: {
            id: '1',
            text: '@Kaitlyn Prouty',
            accessLevel: '',
          },
        },
        { type: 'text', text: ' ' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'mention',
          attrs: {
            id: '2',
            text: '@Verdie Carrales',
            accessLevel: '',
          },
        },
        { type: 'text', text: ' ' },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Goals' }],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'placeholder',
                  attrs: { text: 'Team alignment & updates' },
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'placeholder',
                  attrs: { text: 'Review agenda for the week' },
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'placeholder',
                  attrs: { text: 'Keep shit on track' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Decision items' }],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        __autoSize: false,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [114],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Time' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [137],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Item' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [123],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Who' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Notes' }],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [114],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '5 mins' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [137],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Open actions' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [123],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: 'all',
                        text: '@all',
                        accessLevel: 'CONTAINER',
                        userType: 'SPECIAL',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
              },
              content: [{ type: 'paragraph', content: [] }],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [114],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '30 mins' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [137],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Rollout update' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [123],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '0',
                        text: '@Carolyn',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
              },
              content: [
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'placeholder',
                              attrs: {
                                text: 'Team currently spiking ED-2014',
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'placeholder',
                              attrs: { text: 'Dark mode on hold' },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'placeholder',
                              attrs: {
                                text: 'The new Mount Kimbie record is epic',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [114],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '10 mins' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [137],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Blockers  / risks' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [123],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '19',
                        text: '@Jasmine',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
              },
              content: [
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'placeholder',
                              attrs: {
                                text: 'Currently blocked by ED-2022',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Action items' }],
    },
    {
      type: 'taskList',
      attrs: { localId: 'f82cfc0d-fb38-4317-8991-4d740dc97d0a' },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'bb8cba52-6124-45d2-a66d-5c75c0a0d3af',
            state: 'TODO',
          },
        },
      ],
    },
    { type: 'paragraph', content: [] },
  ],
};
