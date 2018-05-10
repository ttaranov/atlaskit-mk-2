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
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Status' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'inlineExtension',
                      attrs: {
                        extensionKey: 'status',
                        extensionType: 'com.atlassian.confluence.macro.core',
                        parameters: {
                          color: '#505F79',
                          background: '#F4F5F7',
                          title: 'Not Started',
                        },
                        text: 'Not Started',
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
                colspan: 1,
                rowspan: 1,
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Impact' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'placeholder',
                      attrs: { text: 'Describe the impact of this change' },
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
                colspan: 1,
                rowspan: 1,
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Driver' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: 'highlight',
                        text: '@Carolyn',
                        accessLevel: '',
                        userType: null,
                      },
                    },
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
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Approver' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '1',
                        text: '@Kaitlyn Prouty',
                        accessLevel: '',
                        userType: null,
                      },
                    },
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
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Contributors' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '2',
                        text: '@Verdie Carrales',
                        accessLevel: '',
                        userType: null,
                      },
                    },
                    { type: 'text', text: ' ' },
                    {
                      type: 'mention',
                      attrs: {
                        id: '2',
                        text: '@Verdie Carrales',
                        accessLevel: '',
                        userType: null,
                      },
                    },
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
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Informed' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'mention',
                      attrs: {
                        id: '3',
                        text: '@Shae Accetta',
                        accessLevel: '',
                        userType: null,
                      },
                    },
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
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Due date' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'date', attrs: { timestamp: 1525930695707 } },
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
                colwidth: [121],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Outcome' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'placeholder',
                      attrs: { text: 'Write down the outcome' },
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
      content: [{ type: 'text', text: 'Tips and info' }],
    },
    {
      type: 'panel',
      attrs: { panelType: 'success' },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [{ type: 'strong' }],
              text: 'Recommendations',
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
                      type: 'placeholder',
                      attrs: { text: 'Write your recommendation here' },
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
      type: 'panel',
      attrs: { panelType: 'info' },
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'strong' }], text: 'Contributors' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [{ type: 'em' }],
              text:
                "Contributors: I am seeking the right people to get involved in the decision. Add your comments to this page, let's get the conversation started.",
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'em' }], text: 'Please add:' },
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
                      marks: [{ type: 'em' }, { type: 'strong' }],
                      text: 'The people',
                    },
                    {
                      type: 'text',
                      marks: [{ type: 'em' }],
                      text:
                        ' directly impacted by this so we can include them.',
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
                      marks: [{ type: 'em' }, { type: 'strong' }],
                      text: 'Any references',
                    },
                    {
                      type: 'text',
                      marks: [{ type: 'em' }],
                      text:
                        ' to previous work and investigations that we can leverage.',
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
                    { type: 'text', marks: [{ type: 'em' }], text: 'Any ' },
                    {
                      type: 'text',
                      marks: [{ type: 'em' }, { type: 'strong' }],
                      text: 'constraints and challenges',
                    },
                    {
                      type: 'text',
                      marks: [{ type: 'em' }],
                      text:
                        ' we need to consider to make this decision and following action plan.',
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
      type: 'panel',
      attrs: { panelType: 'info' },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [{ type: 'strong' }],
              text: 'Impact rating',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: "Here's an example you can use as a guide." },
          ],
        },
      ],
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
                colwidth: [548],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Decision characteristics' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: [548],
                background: null,
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
                              type: 'text',
                              text:
                                'The decision will have a material impact on the customer experience OR',
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
                              text: 'will significantly impact the roadmap OR',
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
                              text:
                                'will adversely disrupt an internal business process.',
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'inlineExtension',
                      attrs: {
                        extensionKey: 'status',
                        extensionType: 'com.atlassian.confluence.macro.core',
                        parameters: {
                          color: '#BF2600',
                          background: '#FFEBE5',
                          title: 'High',
                        },
                        text: 'High',
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
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [548],
                background: null,
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
                              type: 'text',
                              text:
                                'The decision will involve a less than material change to customer experience OR',
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
                              text: 'will impact the roadmap OR',
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
                              text:
                                'will impact an existing internal business process',
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'inlineExtension',
                      attrs: {
                        extensionKey: 'status',
                        extensionType: 'com.atlassian.confluence.macro.core',
                        parameters: {
                          color: '#FF8B00',
                          background: '#FFFAE5',
                          title: 'Medium',
                        },
                        text: 'Medium',
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
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [548],
                background: null,
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
                            { type: 'text', text: 'All other decisions' },
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'inlineExtension',
                      attrs: {
                        extensionKey: 'status',
                        extensionType: 'com.atlassian.confluence.macro.core',
                        parameters: {
                          color: '#006644',
                          background: '#E3FCEF',
                          title: 'Low',
                        },
                        text: 'Low',
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
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Background' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'placeholder', attrs: { text: 'Background' } }],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Current state' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'placeholder', attrs: { text: 'Current state' } }],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Data for decision support' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'placeholder', attrs: { text: 'Data for decision support' } },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Options considered' }],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'full-width',
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
                colwidth: [198],
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Option 1: Do nothing' }],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Option 2: ' },
                    { type: 'placeholder', attrs: { text: 'Do something' } },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Option 3: ' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'Do something else' },
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
                colspan: 1,
                rowspan: 1,
                colwidth: [198],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Description' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: [198],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Rollout plan' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: [198],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Pros and cons' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: "That'll increase X" },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This will make X faster' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This will save us $$$ 🤑💸' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '❌' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This may effect Y' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '❌' },
                    {
                      type: 'placeholder',
                      attrs: {
                        text: 'This may degrade performance of component Z',
                      },
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: "That'll increase X" },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This will make X faster' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This will save us $$$ 🤑💸' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '❌' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This may effect Y' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '❌' },
                    {
                      type: 'placeholder',
                      attrs: {
                        text: 'This may degrade performance of component Z',
                      },
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: "That'll increase X" },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This will make X faster' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '✅' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This will save us $$$ 🤑💸' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '❌' },
                    {
                      type: 'placeholder',
                      attrs: { text: 'This may effect Y' },
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '❌' },
                    {
                      type: 'placeholder',
                      attrs: {
                        text: 'This may degrade performance of component Z',
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
                colspan: 1,
                rowspan: 1,
                colwidth: [198],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Risks' }],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: [198],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Estimated cost and effort' },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Follow-up action items' }],
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
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'FAQ' }],
    },
    { type: 'paragraph', content: [{ type: 'text', text: 'Q1.' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'A1.' }] },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'References' }],
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
                colwidth: null,
                background: 'rgb(244, 245, 247)',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'strong' }],
                      text: 'Relevance',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: 'rgb(244, 245, 247)',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Link' }],
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
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
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
                colwidth: null,
                background: 'rgb(255, 255, 255)',
              },
              content: [{ type: 'paragraph' }],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [{ type: 'paragraph' }],
            },
          ],
        },
      ],
    },
    { type: 'rule' },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Learn more: ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com/team-playbook/plays/daci',
              },
            },
          ],
          text: 'https://www.atlassian.com/team-playbook/plays/daci',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Copyright © 2016 Atlassian' }],
    },
    {
      type: 'mediaSingle',
      attrs: { layout: 'wrap-left' },
      content: [
        {
          type: 'media',
          attrs: {
            id: '7eead391-3209-43e9-ae87-7c59a56e03c9',
            type: 'file',
            collection: 'MediaServicesSample',
            width: '100',
            height: '35',
            __fileName: 'by-nc-sa.png',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This work is licensed under a ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://creativecommons.org/licenses/by-nc-sa/4.0',
              },
            },
          ],
          text:
            'Creative Commons Attribution-Non Commercial-Share Alike 4.0 International License.',
        },
      ],
    },
    { type: 'paragraph' },
  ],
};
