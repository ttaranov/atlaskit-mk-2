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
          text: 'Paste links to popular services here...',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
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
          text:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sem turpis, imperdiet quis augue eu, ultricies dictum nulla. Etiam ullamcorper justo diam, quis fringilla tortor ',
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
          text:
            ' nullam in maximus lacus. Integer fermentum eros ante, mattis tempor lacus volutpat eget. Pellentesque risus libero, luctus ac ex et, tempus accumsan orci.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Here are some example URLs to get you started:',
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
            'https://docs.google.com/spreadsheets/d/1pHwRAZWA7_aGtlAwOjAOrHGoT5gT0oKS635HTI6gI8I/edit?usp=drive_web&ouid=110769160460483925018',
        },
      ],
    },
  ],
};
