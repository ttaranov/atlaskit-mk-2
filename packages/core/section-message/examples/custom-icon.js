// @flow
import React from 'react';
import JiraLabsIcon from '@atlaskit/icon/glyph/jira/labs';
import SectionMessage from '../src';

const Example = () => (
  <SectionMessage
    icon={JiraLabsIcon}
    title="Some eye-catching info before you continue"
    actions={[
      {
        href: 'https://en.wikipedia.org/wiki/Mary_Shelley',
        text: 'This may help',
      },
      {
        href: 'https://en.wikipedia.org/wiki/Villa_Diodati',
        text: 'A second exit point',
      },
    ]}
  >
    <p>
      We wanted to ensure that you read this information, so we have put it into
      a section message. Once you have read it, there are a few actions you may
      want to take, otherwise you can continue on the flow of the application.
    </p>
  </SectionMessage>
);

export default Example;
