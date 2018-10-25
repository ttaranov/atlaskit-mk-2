import * as React from 'react';
import SectionMessage from '@atlaskit/section-message';

import { default as FullPageExample } from './5-full-page';

export default function Example() {
  return (
    <div>
      <SectionMessage title="Smart Cards in the Editor">
        <p>
          Try pasting URLs to Google Drive, Asana, Dropbox, Trello etc. Links
          pasted in empty paragraphs will create a bigger, block card. Links
          pasted inside other elements (like lists, tables, panels) will be
          converted to a smaller, inline version of card. A gallery of different
          types of cards{' '}
          <a href="/packages/media/smart-card/example/gallery">
            can be found here
          </a>
        </p>
      </SectionMessage>
      <FullPageExample defaultValue={exampleDocument} />
    </div>
  );
}

const exampleDocument = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Here's an example of a block Smart Card:",
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        url:
          'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Here's an inline card surrounded by text:",
          marks: [
            {
              type: 'strong',
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
          text: 'Check out this document ',
          marks: [{ type: 'em' }],
        },
        {
          type: 'inlineCard',
          attrs: {
            url:
              'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
          },
        },
        {
          type: 'text',
          text: ' and let me know what you think...',
          marks: [{ type: 'em' }],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Here are some example URLs to get you started. You can copy and paste them back into the Editor - they will get converted into cards',
          marks: [
            {
              type: 'strong',
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
            'https://docs.google.com/document/d/1nXGwmxJuvQ8CdVQsGnRLOJOo7kJPqesmiBgvcaXD4Aw/edit',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://app.box.com/s/2emx282bjxpzvwa5bcz428u6imbgmasg',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://invis.io/P8OKINLRQEH',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://1drv.ms/u/s!Agkn_W9yVS7uaT4sLTx8bl2WYrs',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://trello.com/c/gfrst89H/4-much-muffins',
        },
      ],
    },
  ],
};
