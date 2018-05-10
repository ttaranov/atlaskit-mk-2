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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Project name and link',
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Project sponsor',
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '1 owner',
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Health monitor cadence',
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
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Overall health: ',
        },
        {
          type: 'inlineExtension',
          attrs: {
            extensionKey: 'status',
            extensionType: 'com.atlassian.confluence.macro.core',
            parameters: {
              color: '#006644',
              background: '#E3FCEF',
              title: 'Healthy',
            },
            text: 'Healthy',
          },
        },
        {
          type: 'inlineExtension',
          attrs: {
            extensionKey: 'status',
            extensionType: 'com.atlassian.confluence.macro.core',
            parameters: {
              color: '#FF8B00',
              background: '#FFFAE5',
              title: 'Bit Sick',
            },
            text: 'Bit Sick',
          },
        },
        {
          type: 'inlineExtension',
          attrs: {
            extensionKey: 'status',
            extensionType: 'com.atlassian.confluence.macro.core',
            parameters: {
              color: '#BF2600',
              background: '#FFEBE5',
              title: 'Sick',
            },
            text: 'Sick',
          },
        },
      ],
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
                rowspan: 2,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Area',
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
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Example',
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
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Date',
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
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Date',
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
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Date',
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
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1525914927351,
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'Full time owner',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'There is ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'one lead who is accountable',
                    },
                    {
                      type: 'text',
                      text:
                        ' for the result of this project. This needs to be someone whose time at least 80% dedicated  to it, and who can champion the mission inside and outside of the team.',
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
                background: '#ffebe6',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'Some team members thought it was Rebecca and others thought it was Steve.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'This is causing confusion for the project team.',
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
                              text:
                                'We need to clarify who is the project owner.',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'Balanced team',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'Roles and responsibilities are clear and agreed upon. The project has ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'people with the blend of skill set',
                    },
                    {
                      type: 'text',
                      text:
                        '. Acknowledge that team members can change by stage.',
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
                background: '#e3fcef',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'The team is well stuffed for now.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'We’re green today but trending red. Our designer John has just resigned and is leaving next month. So we’ll need to fill this gap quickly otherwise we’ll go red.',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'Shared understanding',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'The team has a common understanding of ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'why they’re here',
                    },
                    {
                      type: 'text',
                      text:
                        ', the problem/need, are convinced about the idea, confident they have what they need, and trust each other.',
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
                background: '#ffebe6',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'We don’t agree on the customer problem this project is solving.',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'Value and metrics',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'It’s clear what success means from a business and user’s perspective, and there is a unique value proposition in place for the target users and to the business. Success is defined, with a goal, and how it will be measured.',
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
                background: '#ffebe6',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'Our problem statement isn’t clear so we are not on the same page in the value we’re going to deliver.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'This is really frustrating.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'We therefor don’t have clear and quantifiable project success measures.',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'Proof of concept',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'The project is summarised in a one pager and shared with anyone so that they understand the purpose of the project, and its value.',
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
                background: '#e3fcef',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'This is our project space homepage.',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'Managed dependencies',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'Clear understanding of complexity, infrastructure involved, risks, resource, efforts and timeline. Clear understanding of who we depend on, and who depends on us.',
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
                background: '#e3fcef',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'Dependencies are tracked in our dependency register and they’re not causing us any problems - they are being actively managed with external teams.',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                      text: 'Velocity',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'The team is making incremental progress by shipping concrete iterations to stakeholders (and even better to production), learning along the way, and implementing lessons learned along the way, resulting in greater success.',
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
                background: '#fffae6',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text:
                        'We’re running hard and hitting our milestones, however we need to ensure our continual improvement actions get DONE. These need to be tracked as project task not just ‘homework’ activities.',
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
                },
                {
                  type: 'paragraph',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Notes, actions and due dates:',
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
                colwidth: [150],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Date',
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
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Notes & actions',
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
                colwidth: [150],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'date',
                      attrs: {
                        timestamp: 1525917688657,
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
                      type: 'text',
                      text: 'Two focus areas: FTO & shared understanding',
                    },
                  ],
                },
                {
                  type: 'taskList',
                  attrs: {
                    localId: '13558732-175e-4fd1-a45b-7f95f19fb167',
                  },
                  content: [
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'b0874159-f552-4225-951a-d38a9bd841db',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text: '@mention <action> due date DD/MM/YY.',
                        },
                      ],
                    },
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'af3db2ba-ab02-499b-9bad-75d8df573eae',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text:
                            '@Rebecca and @Steve to discuss project ownership and advice the team who exactly is the  project lead by ',
                        },
                        {
                          type: 'date',
                          attrs: {
                            timestamp: 1527170400000,
                          },
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                      ],
                    },
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: '80e4442d-df4d-4908-b2f2-2c381d31c4c6',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text:
                            '@Mary to organise a 5 Whys play session so we can go deep on our problem space and really understand what we’re going after. Problem definition to be agreed by ',
                        },
                        {
                          type: 'date',
                          attrs: {
                            timestamp: 1527170400000,
                          },
                        },
                        {
                          type: 'text',
                          text: ' ',
                        },
                      ],
                    },
                    {
                      type: 'taskItem',
                      attrs: {
                        localId: 'd1d2bf73-8c5e-48ab-abe0-a90aff571131',
                        state: 'TODO',
                      },
                      content: [
                        {
                          type: 'text',
                          text:
                            '@David to schedule an Elevator Pitch play for the team, so we move our shared understanding to green - Elevator Pitch to be completed by ',
                        },
                        {
                          type: 'date',
                          attrs: {
                            timestamp: 1527170400000,
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
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [150],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
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
                colwidth: [150],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
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
                colwidth: [150],
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
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
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
