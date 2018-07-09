// @flow

import type { DataShape } from '../types';

const data: DataShape = {
  settings: {
    theme: 'light',
    customText: null,
    customBackground: null,
  },
  projects: [
    {
      name: 'Design system',
      boards: [
        {
          name: 'The A Team',
          issues: [
            {
              name: 'Avatar border color is wrong',
              status: 'TODO',
              type: 'BUG',
            },
            {
              name: 'Badge sucks',
              status: 'INPROGRESS',
              type: 'TASK',
            },
            {
              name: 'Flags are bad',
              status: 'DONE',
              type: 'FEATURE',
            },
          ],
        },
        {
          name: 'The Wizards',
          issues: [
            {
              name: 'Blanket is broken',
              status: 'TODO',
              type: 'BUG',
            },
            {
              name: 'LayerManager sucks',
              status: 'INPROGRESS',
              type: 'TASK',
            },
            {
              name: 'Theming is bad',
              status: 'DONE',
              type: 'FEATURE',
            },
          ],
        },
        {
          name: 'Reformed',
          issues: [
            {
              name: 'Calendar is broken',
              status: 'TODO',
              type: 'BUG',
            },
            {
              name: 'Checkbox sucks',
              status: 'INPROGRESS',
              type: 'TASK',
            },
            {
              name: 'Select is bad',
              status: 'DONE',
              type: 'FEATURE',
            },
          ],
        },
      ],
      shortcuts: [
        {
          name: 'Navigation team space',
          url: 'https://product-fabric.atlassian.net/wiki/spaces/NAV/overview',
        },
      ],
      pages: [
        {
          name: 'Navigation conceptual model',
          content: 'Lorem ipsum',
        },
      ],
    },
  ],
};

export default data;
