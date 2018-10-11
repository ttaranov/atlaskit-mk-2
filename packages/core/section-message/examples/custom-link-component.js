// @flow
import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import SectionMessage from '../src';

const CustomLink = ({ href, ...rest }: { href: string }) => (
  <Link {...rest} to={href} />
);

const Example = () => (
  <MemoryRouter>
    <SectionMessage
      linkComponent={CustomLink}
      title="Some eye-catching info before you continue"
      actions={[
        {
          href: '/',
          text: 'This may help',
        },
        {
          href: '/',
          text: 'A second exit point',
        },
      ]}
    >
      <p>
        We wanted to ensure that you read this information, so we have put it
        into a section message. Once you have read it, there are a few actions
        you may want to take, otherwise you can continue on the flow of the
        application.
      </p>
    </SectionMessage>
  </MemoryRouter>
);

export default Example;
