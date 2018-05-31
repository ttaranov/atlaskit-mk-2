export const DefaultDocument: any = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'heading',
      content: [
        {
          type: 'text',
          text: 'Performance testing results',
        },
      ],
      attrs: {
        level: 2,
      },
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        viewMode: 'donut',
        viewModeSettings: {
          donut: {
            values: 1,
          },
          barchart: {
            values: 1,
          },
        },
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [169],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Step',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Response time (ms)',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Requests/s',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colwidth: [128],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Passed',
                      marks: [
                        {
                          type: 'strong',
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
              type: 'tableHeader',
              attrs: {
                colwidth: [169],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Login',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '345',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '9000',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [128],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':check_mark:',
                        id: 'atlassian-check_mark',
                        text: ':check_mark:',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
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
              type: 'tableHeader',
              attrs: {
                colwidth: [169],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'View project',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '533',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '3000',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [128],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':check_mark:',
                        id: 'atlassian-check_mark',
                        text: ':check_mark:',
                      },
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
              type: 'tableHeader',
              attrs: {
                colwidth: [169],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Update project',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '1388',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '2000',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [128],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':cross_mark:',
                        id: 'atlassian-cross_mark',
                        text: ':cross_mark:',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
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
              type: 'tableHeader',
              attrs: {
                colwidth: [169],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Comment',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '3453',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '2000',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [128],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':cross_mark:',
                        id: 'atlassian-cross_mark',
                        text: ':cross_mark:',
                      },
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
              type: 'tableHeader',
              attrs: {
                colwidth: [169],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Close project',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '2345',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '3000',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colwidth: [128],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'emoji',
                      attrs: {
                        shortName: ':check_mark:',
                        id: 'atlassian-check_mark',
                        text: ':check_mark:',
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
      type: 'heading',
      content: [
        {
          type: 'text',
          text: 'Program schedule',
        },
      ],
      attrs: {
        level: 2,
      },
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        viewMode: 'timeline',
        viewModeSettings: {
          timeline: {
            start: 1,
            end: 2,
            gridlines: true,
          },
        },
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Project',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Start date',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'End date',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Owner',
                      marks: [
                        {
                          type: 'strong',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'PC-123 Performance improvements',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1520208000000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1527206400000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
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
                    {
                      type: 'text',
                      text: ' ',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'PC-129 Simplified login',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1522627200000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1532649600000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
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
                    {
                      type: 'text',
                      text: ' ',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'PC-193 Project admin',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1525651200000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1535673600000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '6',
                        text: '@April',
                        accessLevel: '',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
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
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'PC-119 UX paper cuts',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1528070400000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1532649600000,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
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
                    {
                      type: 'text',
                      text: ' ',
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
};
