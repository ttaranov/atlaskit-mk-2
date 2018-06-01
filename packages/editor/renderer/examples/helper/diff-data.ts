export const diffDocs = {
  simple: {
    oldDocument: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello there. mate!',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'My name is Oscar and I would like to talk to you about some stuff.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec posuere purus enim, lacinia volutpat dolor vestibulum nec. In viverra vulputate augue, sit amet porta mi tincidunt et. Maecenas feugiat diam sit amet arcu convallis efficitur. Quisque consequat vel nunc vel mollis. In interdum nisl ac convallis condimentum. Aliquam luctus, arcu nec porta pharetra, neque tellus scelerisque metus, sit amet viverra arcu odio nec mauris. Donec porta augue vitae tincidunt placerat.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Good bye!',
            },
          ],
        },
      ],
    },
    newDocument: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Well hello there, mate!',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'My name is Oscar and I would like to talk to you about ',
            },
            {
              type: 'text',
              text: 'some',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
            {
              type: 'text',
              text: ' stuff. Bla bla bla, and bla bla bla.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec posuere purus enim, lacinia volutpat dolor vestibulum nec. In viverra vulputate augue, sit amet porta mi tincidunt et. Maecenas feugiat diam sit amet arcu convallis efficitur. Quisque consequat vel nunc vel mollis. In interdum nisl ac convallis condimentum. Aliquam luctus, arcu nec porta pharetra, neque tellus scelerisque metus, sit amet viverra arcu odio nec mauris. Donec porta augue vitae tincidunt placerat.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Good bye!',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Yes.. lorem ipsum',
            },
          ],
        },
      ],
    },
  },
  simple2: {
    oldDocument: {
      type: 'doc',
      version: 13,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'yo',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World!',
            },
            {
              type: 'text',
              text: 'My name is ',
            },
            {
              type: 'mention',
              attrs: {
                text: '@oscar',
                id: '@oscar',
              },
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Testing testing',
            },
          ],
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'info',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "Don't do this!",
                },
              ],
            },
          ],
        },
        {
          type: 'codeBlock',
          content: [
            {
              type: 'text',
              text: "if (true) {\n console.log('hello'); \n}",
            },
          ],
        },
      ],
    },
    newDocument: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'yo',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello ',
            },
            {
              type: 'text',
              text: 'World!',
              marks: [{ type: 'strong' }],
            },
            {
              type: 'text',
              text: 'My name is ',
            },
            {
              type: 'mention',
              attrs: {
                text: '@oscar',
                id: '@oscar',
              },
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Testing testing',
            },
          ],
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'warning',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "Don't do this!",
                },
              ],
            },
          ],
        },
        {
          type: 'codeBlock',
          content: [
            {
              type: 'text',
              text: "if (true) {\n console.log('hello'); \n}",
            },
          ],
        },
      ],
    },
  },
  table: {
    oldDocument: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: false,
            layout: 'default',
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
                          text: 'Name',
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
                          text: 'Email',
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
                          text: 'Status',
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
                          text: 'Oscar Wallhult',
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
                          text: 'owallhult@atlassian.com',
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
                          text: 'No',
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
                          text: 'Someone else',
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
                          text: 'hello@atlassian.com',
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
                          text: 'No',
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
                          text: 'Another person',
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
                          text: 'yeye@atlassian.com',
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
                          text: 'Yes',
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
                          text: 'THE LAST PERSON',
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
                          text: 'yeye@atlassian.com',
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
                          text: 'Yes',
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
    newDocument: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: false,
            layout: 'default',
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
                          text: 'Name',
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
                          text: 'Email',
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
                          text: 'Status',
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
                          text: 'Oscar Wallhult',
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
                          text: 'owallhult@atlassian.com',
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
                          text: 'No',
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
                          text: 'Someone else!',
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
                          text: 'hello@atlassian.com',
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
                          text: 'No',
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
                          text: 'Banana',
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
                          text: 'yeye@atlassian.com',
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
                          text: 'Yes',
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
                          text: 'Another person',
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
                          text: 'yeye@atlassian.com',
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
                          text: 'Yes',
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
                          text: 'THE LAST PERSON',
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
                          text: 'yeye@atlassian.com',
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
                          text: 'Yes',
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
  },
  lists: {
    oldDocument: {
      version: 1,
      type: 'doc',
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
                      type: 'text',
                      text: 'One',
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
                      type: 'text',
                      text: 'Two',
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
                      type: 'text',
                      text: 'Three',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [],
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
                      type: 'text',
                      text: 'A',
                    },
                  ],
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
                              type: 'text',
                              text: 'AA',
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
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'B',
                    },
                  ],
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
                              type: 'text',
                              text: 'BB',
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
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'C',
                    },
                  ],
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
                              type: 'text',
                              text: 'CC',
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
    newDocument: {
      version: 1,
      type: 'doc',
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
                      type: 'text',
                      text: 'One',
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
                      type: 'text',
                      text: 'Hello',
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
                      type: 'text',
                      text: 'Three',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [],
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
                      type: 'text',
                      text: 'A',
                    },
                  ],
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
                              type: 'text',
                              text: 'AA',
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
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'B',
                    },
                  ],
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
                              type: 'text',
                              text: 'BB',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            // {
            //   "type": "listItem",
            //   "content": [
            //     {
            //       "type": "paragraph",
            //       "content": [
            //         {
            //           "type": "text",
            //           "text": "Hi!"
            //         }
            //       ]
            //     },
            //   ]
            // },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'C',
                    },
                  ],
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
                              type: 'text',
                              text: ':)',
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
  },
};
