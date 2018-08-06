// tslint:disable:no-console

import * as React from 'react';
import { Component } from 'react';
import { EditorAppearance, EditorProps } from '../src/types';
import Editor from '../src/editor';
import getPropsPreset from '../src/create-editor/get-props-preset';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { taskDecisionDocFilter } from '../src/utils/filter/';
import { toJSON, JSONDocNode, JSONNode } from '../src/utils/';
import { ProviderFactory } from '@atlaskit/editor-common';
import { ReactRenderer } from '@atlaskit/renderer';

const SAVE_ACTION = () => console.log('Save');
const analyticsHandler = (actionName, props) => console.log(actionName, props);

interface State {
  filteredContent: JSONNode[];
}

const document = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'World!',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' Look I can do ',
        },
        {
          type: 'text',
          text: 'italic ',
          marks: [
            {
              type: 'em',
            },
          ],
        },
        {
          type: 'text',
          text: ', strong ',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'strong',
            },
          ],
        },
        {
          type: 'text',
          text: 'and underlined text!',
          marks: [
            {
              type: 'em',
            },
            {
              type: 'strong',
            },
            {
              type: 'underline',
            },
          ],
        },
        {
          type: 'text',
          text: ' and action mark',
          marks: [
            {
              type: 'action',
              attrs: {
                key: 'test-action-key',
                title: 'test action mark',
                target: {
                  receiver: 'some-receiver',
                  key: 'some-key',
                },
                parameters: {
                  test: 20,
                },
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' and invalid action mark',
          marks: [
            {
              type: 'action',
              attrs: {
                key: 'test-action-key',
                title: 'test action mark',
                target: {
                  receiver: 'some-receiver',
                },
                parameters: {
                  test: 30,
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'My favourite emoji are ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':grin:',
            id: '1f601',
            text: '😁',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':evilburns:',
            id: 'atlassian-evilburns',
            text: ':evilburns:',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':not-an-emoji:',
          },
        },
        {
          type: 'text',
          text: '. What are yours?',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hi, my name is... My name is... My name is... My name is ',
        },
        {
          type: 'mention',
          attrs: {
            id: '1',
            text: '@Oscar Wallhult',
          },
        },
        {
          type: 'text',
          text: ' :D',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a ',
        },
        {
          type: 'mention',
          attrs: {
            text: '@mention',
            id: '2',
          },
        },
        {
          type: 'text',
          text: '. And this is a broken ',
        },
        {
          type: 'mention',
          attrs: {
            textxtx: '@mention',
            id: 'mention',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Mention with restricted access',
        },
        {
          type: 'mention',
          attrs: {
            id: '1',
            accessLevel: 'APPLICATION',
          },
          text: '@oscar',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Mentions with generic ids',
        },
        {
          type: 'mention',
          attrs: {
            id: 'here',
            accessLevel: 'CONTAINER',
          },
          text: '@here',
        },
        {
          type: 'mention',
          attrs: {
            id: 'all',
            accessLevel: 'CONTAINER',
          },
          text: '@all',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'This is  a   text    with\tmultiple\t\tspaces \t\t\tand\t\t\t\ttabs.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'italic',
          marks: [
            {
              type: 'em',
            },
          ],
        },
        {
          type: 'text',
          text: 'link',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'strike-through',
          marks: [
            {
              type: 'strike',
            },
          ],
        },
        {
          type: 'text',
          text: 'strong',
          marks: [
            {
              type: 'strong',
            },
          ],
        },
        {
          type: 'text',
          text: 'sub',
          marks: [
            {
              type: 'subsup',
              attrs: {
                type: 'sub',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'sup',
          marks: [
            {
              type: 'subsup',
              attrs: {
                type: 'sup',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'underline',
          marks: [
            {
              type: 'underline',
            },
          ],
        },
        {
          type: 'text',
          text: ' red text',
          marks: [
            {
              type: 'textColor',
              attrs: {
                color: '#ff0000',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'some inline code: ',
        },
        {
          type: 'text',
          text: 'const foo = bar();',
          marks: [
            {
              type: 'code',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'hardBreak',
        },
        {
          type: 'hardBreak',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a line with ',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: 'a hardbreak in it.',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 1',
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
          text: 'Heading 2',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'www.atlassian.com',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 3',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 4,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 4',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 5,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 5',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 6,
      },
      content: [
        {
          type: 'text',
          text: 'Heading 6',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a paragraph with a text node',
        },
        {
          type: 'text',
          text: '\n',
        },
        {
          type: 'text',
          text: 'that contains a new line',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Click me! ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'javascript:alert("hello world")',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'www.atlassian.com',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'www.atlassian.com',
              },
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
          text:
            '// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);',
        },
        {
          type: 'text',
          text:
            '\nint count = map.forEach(new IntIntProcedure()\n{\n   int count;\n   public void apply(int key, int value)\n   {\n       if (value >= 5) count++;\n   }\n}).count;\nSystem.out.println("There are " + count + " values >= 5");',
        },
      ],
      attrs: {
        language: 'javascript',
      },
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
                  text: 'First list item',
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
                  text: 'Second list item',
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
                  text: 'Third list item',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'First list item',
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
                  text: 'Second list item',
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
                  text: 'Third list item',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'All that is gold does not glitter, not all those who wander are lost; The old that is strong does not wither, deep roots are not reached by the frost.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'From the ashes a fire shall be woken, a light from the shadows shall spring; Renewed shall be blade that was broken, the crownless again shall be king.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'J.R.R. Tolkien, The Fellowship of the Ring.',
              marks: [
                {
                  type: 'em',
                },
              ],
            },
          ],
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
              text: 'This is an info panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
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
      type: 'panel',
      attrs: {
        panelType: 'note',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a note panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
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
      type: 'panel',
      attrs: {
        panelType: 'tip',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a tip panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
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
      type: 'panel',
      attrs: {
        panelType: 'success',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a success panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
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
              text: 'This is a warning panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
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
      type: 'panel',
      attrs: {
        panelType: 'error',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a error panel with ',
            },
            {
              type: 'text',
              text: 'bold text',
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
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Do not use this image node; it may be removed at any time without notice.',
        },
        {
          type: 'image',
          attrs: {
            src:
              'https://www.google.com.au/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            alt: 'Google Logo',
            title: 'Google!',
          },
        },
        {
          type: 'text',
          text:
            'Do not use this image node; it may be removed at any time without notice.',
        },
      ],
    },
    {
      type: 'applicationCard',
      text: 'applicationCard',
      attrs: {
        text: 'applicationCard',
        background: {
          url: 'http://atlassian.com',
        },
        link: {
          url: 'http://atlassian.com',
        },
        title: {
          text: 'Sascha Reuter commented on a file: Desktop sidebar states.png',
        },
        user: {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/2246873520/sreuter-57703-pp-1530510_4271148635152_5186589029777108540_n.jpg',
            label: 'Sascha Reuter',
          },
        },
        preview: {
          url:
            'https://image.ibb.co/ghKzoF/1a99566b0c8e0589ca327bb1efe0be5ca1419aa8.png',
        },
        description: {
          title: 'Can haz description',
          text:
            '\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius mattis massa, quis ornare orci. Integer congue\nrutrum velit, quis euismod eros condimentum quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris\nlobortis nibh id odio egestas luctus. Nunc nulla lacus, congue eu nibh non, imperdiet varius lacus. Nulla sagittis\nmagna et tincidunt volutpat. Nunc augue lorem, eleifend et tempor ut, malesuada ac lorem. Praesent quis feugiat eros,\net vehicula nibh. Maecenas vehicula commodo nisi, at rutrum ipsum posuere sit amet. Integer sit amet nisl sed ligula\nconsectetur feugiat non at ligula. Cras dignissim suscipit magna at mattis. Maecenas ante leo, feugiat vestibulum velit\na, commodo finibus velit. Maecenas interdum ullamcorper velit non suscipit. Proin tempor, magna vitae dapibus laoreet,\nquam dui convallis lectus, in vestibulum arcu eros eu velit. Quisque vel dolor enim.\n',
        },
        details: [
          {
            icon: {
              url:
                'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
              label: 'Issue type',
            },
            text: 'Story',
          },
          {
            badge: {
              value: 101,
              max: 99,
              appearance: 'important',
            },
          },
          {
            lozenge: {
              text: 'In Progress',
              appearance: 'inprogress',
            },
          },
          {
            title: 'Watchers',
            users: [
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
                  label: 'James Newell',
                },
              },
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
                  label: 'Jon Blower',
                },
              },
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
                  label: 'Scott Simpson',
                },
              },
            ],
          },
          {
            icon: {
              url:
                'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
              label: 'Issue type',
            },
            text: 'Story',
          },
          {
            badge: {
              value: 101,
              max: 99,
              appearance: 'important',
            },
          },
          {
            lozenge: {
              text: 'In Progress',
              appearance: 'inprogress',
            },
          },
          {
            title: 'Watchers',
            users: [
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
                  label: 'James Newell',
                },
              },
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
                  label: 'Jon Blower',
                },
              },
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
                  label: 'Scott Simpson',
                },
              },
            ],
          },
          {
            icon: {
              url:
                'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
              label: 'Issue type',
            },
            text: 'Story',
          },
          {
            badge: {
              value: 101,
              max: 99,
              appearance: 'important',
            },
          },
          {
            lozenge: {
              text: 'In Progress',
              appearance: 'inprogress',
            },
          },
          {
            title: 'Watchers',
            users: [
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
                  label: 'James Newell',
                },
              },
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
                  label: 'Jon Blower',
                },
              },
              {
                icon: {
                  url:
                    'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
                  label: 'Scott Simpson',
                },
              },
            ],
          },
        ],
        context: {
          text: 'Design Home / ... / Media Cards Design',
          icon: {
            url:
              'https://image.ibb.co/jSrC8F/f4b5e33d6b1d36556114a18b594768f41f32673e.png',
            label: 'foobar',
          },
          link: {
            url: 'https://confluence.atlassian.com/',
          },
        },
      },
    },
    {
      type: 'decisionList',
      attrs: {
        localId: 'empty-list-should-not-render',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: 'to-be-ignored-as-no-content',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'taskList',
      attrs: {
        localId: 'empty-list-should-not-render',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'to-be-ignored-as-no-content',
            state: 'TODO',
          },
        },
      ],
    },
    {
      type: 'decisionList',
      attrs: {
        localId: '',
      },
      content: [
        {
          type: 'decisionItem',
          attrs: {
            localId: '',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'Hello world',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'This is a decision ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':wink:',
                id: '1f609',
                text: '😉',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'mention',
              attrs: {
                id: '0',
                text: '@Carolyn',
                accessLevel: 'CONTAINER',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'was',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'here',
              marks: [
                {
                  type: 'em',
                },
                {
                  type: 'underline',
                },
              ],
            },
            {
              type: 'text',
              text: '.',
            },
            {
              type: 'mention',
              attrs: {
                id: 'error:NotFound',
                text: '@NoLongerWorksHere',
                accessLevel: 'CONTAINER',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'is not',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'here.',
            },
          ],
        },
        {
          type: 'decisionItem',
          attrs: {
            localId: '',
            state: 'DECIDED',
          },
          content: [
            {
              type: 'text',
              text: 'decision 2',
            },
          ],
        },
        {
          type: 'decisionItem',
          attrs: {
            localId: 'to-be-ignored-as-no-content',
            state: 'DECIDED',
          },
        },
      ],
    },
    {
      type: 'taskList',
      attrs: {
        localId: '',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'task-1',
            state: 'TODO',
          },
          content: [
            {
              type: 'text',
              text: 'Could you please',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'do this ',
            },
            {
              type: 'mention',
              attrs: {
                id: '0',
                text: '@Carolyn',
                accessLevel: 'CONTAINER',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':wink:',
                id: '1f609',
                text: '😉',
              },
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: 'task-2',
            state: 'DONE',
          },
          content: [
            {
              type: 'text',
              text: 'This is completed',
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            localId: 'to-be-ignored-as-no-content',
            state: 'TODO',
          },
        },
      ],
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {
                colspan: 2,
                colwidth: [233, 100],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'header',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {
                background: '#DEEBFF',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'header',
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
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cell',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cell',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cell',
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
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cell',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cell',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'cell',
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
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'com.atlassian.fabric',
        extensionKey: 'clock',
        bodyType: 'rich',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is the default content of the extension',
            },
          ],
        },
      ],
    },
  ],
};

interface Props {
  appearance?: EditorAppearance;
  renderToDocument: (content: JSONNode[]) => JSONDocNode;
}

class DecisionBuilderToolsDrawer extends Component<Props, State> {
  private providerFactory: ProviderFactory;

  constructor(props) {
    super(props);
    this.state = {
      filteredContent: [],
    };
    this.providerFactory = new ProviderFactory();
  }

  onChange = delegateOnChange => editorView => {
    this.setState({
      filteredContent: taskDecisionDocFilter(toJSON(editorView.state.doc)),
    });

    return delegateOnChange(editorView);
  };

  private handleProviders(props: EditorProps) {
    const {
      emojiProvider,
      mentionProvider,
      mediaProvider,
      taskDecisionProvider,
      contextIdentifierProvider,
    } = props;
    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider('mediaProvider', mediaProvider);
    this.providerFactory.setProvider(
      'taskDecisionProvider',
      taskDecisionProvider,
    );
    this.providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
  }

  render() {
    const { filteredContent } = this.state;
    const { appearance, renderToDocument } = this.props;

    return (
      <div>
        <h4>Decision:</h4>
        <ReactRenderer
          document={renderToDocument(filteredContent)}
          dataProviders={this.providerFactory}
        />
        <h5>Content:</h5>
        <pre>{JSON.stringify(filteredContent, undefined, 2)}</pre>
        <h4>Raw content:</h4>
        <ToolsDrawer
          renderEditor={({
            disabled,
            mentionProvider,
            emojiProvider,
            mediaProvider,
            taskDecisionProvider,
            contextIdentifierProvider,
            onChange,
          }) => {
            this.handleProviders({
              mentionProvider,
              emojiProvider,
              mediaProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
            });

            return (
              <Editor
                {...getPropsPreset(appearance)}
                analyticsHandler={analyticsHandler}
                defaultValue={document}
                disabled={disabled}
                maxHeight={305}
                mentionProvider={mentionProvider}
                emojiProvider={emojiProvider}
                mediaProvider={mediaProvider}
                taskDecisionProvider={taskDecisionProvider}
                contextIdentifierProvider={contextIdentifierProvider}
                onChange={this.onChange(onChange)}
                onSave={SAVE_ACTION}
                quickInsert={true}
                allowPanel={true}
                allowCodeBlocks={true}
                allowDate={true}
              />
            );
          }}
        />
      </div>
    );
  }
}

export default function Example() {
  return (
    <DecisionBuilderToolsDrawer
      appearance="message"
      renderToDocument={content => ({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'decisionList',
            content: [
              {
                type: 'decisionItem',
                content,
              },
            ],
          },
        ],
      })}
    />
  );
}
