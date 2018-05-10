export default {
  type: 'doc',
  content: [
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
                colwidth: [196],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Date' }],
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
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: '1525913220238' } },
                    { type: 'text', text: ' ' },
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
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [196],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Participants' }],
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
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '4',
                        text: '@Summer',
                        accessLevel: '',
                      },
                    },
                    { type: 'text', text: ' ' },
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
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Retrospective' }],
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
                colwidth: [304],
                background: '#e3fcef',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'What did we do well?' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                background: '#ffebe6',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'What should we have done better?',
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
                colwidth: [304],
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
                                text: 'List all items that you did well',
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
                                text:
                                  'List all items that you should have done better',
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
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Actions' }],
    },
    {
      type: 'taskList',
      attrs: { localId: 'f1b20003-0a7d-4cc3-806d-f9c92daab5e3' },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'e89f19c8-8ac4-4464-b44f-5b6e0a3d5baf',
            state: 'TODO',
          },
          content: [
            {
              type: 'placeholder',
              attrs: {
                text: '@mention a person to assign an action to them',
              },
            },
          ],
        },
      ],
    },
    { type: 'paragraph', content: [] },
  ],
};
