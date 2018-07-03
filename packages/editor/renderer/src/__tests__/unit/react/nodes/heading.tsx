import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Heading from '../../../../react/nodes/heading';
import { HeadingLevel } from '../../../../react/nodes/heading';

const contentGenerator = headerText => {
  const content = [
    {
      type: 'text',
      text: headerText,
    },
  ];
  return content;
};

describe('<Heading />', () => {
  let headers = [];
  for (let i = 1; i < 7; i++) {
    const header = shallow(
      <Heading
        level={i as HeadingLevel}
        content={contentGenerator(`This is a Heading ${i}`)}
      >
        This is a Heading {i}
      </Heading>,
    );
    // @ts-ignore
    headers.push(header);
  }

  it('should wrap content with <h1>-tag', () => {
    // @ts-ignore
    expect(headers[0].name()).to.equal('h1');
    // @ts-ignore
    expect(headers[0].prop('id')).to.equal('This-is-a-Heading-1');
  });

  it('should wrap content with <h2>-tag', () => {
    // @ts-ignore
    expect(headers[1].name()).to.equal('h2');
    // @ts-ignore
    expect(headers[1].prop('id')).to.equal('This-is-a-Heading-2');
  });

  it('should wrap content with <h3>-tag', () => {
    // @ts-ignore
    expect(headers[2].name()).to.equal('h3');
    // @ts-ignore
    expect(headers[2].prop('id')).to.equal('This-is-a-Heading-3');
  });

  it('should wrap content with <h4>-tag', () => {
    // @ts-ignore
    expect(headers[3].name()).to.equal('h4');
    // @ts-ignore
    expect(headers[3].prop('id')).to.equal('This-is-a-Heading-4');
  });

  it('should wrap content with <h5>-tag', () => {
    // @ts-ignore
    expect(headers[4].name()).to.equal('h5');
    // @ts-ignore
    expect(headers[4].prop('id')).to.equal('This-is-a-Heading-5');
  });

  it('should wrap content with <h6>-tag', () => {
    // @ts-ignore
    expect(headers[5].name()).to.equal('h6');
    // @ts-ignore
    expect(headers[5].prop('id')).to.equal('This-is-a-Heading-6');
  });

  it('should have heading id', () => {
    const headingContent = [
      {
        type: 'text',
        text: 'This is a Heading',
      },
      {
        type: 'emoji',
        attrs: {
          shortName: ':grin:',
          id: '1f601',
          text: ' 😁 ',
        },
      },
      {
        type: 'text',
        text: 'with a emoji',
        marks: [
          {
            type: 'link',
            attrs: {
              href: 'www.atlassian.com',
            },
          },
        ],
      },
    ];

    const heading = shallow(
      <Heading level={1} content={headingContent}>
        This is a Heading 😁 with a emoji
      </Heading>,
    );
    expect(heading.name()).to.equal('h1');
    expect(heading.prop('id')).to.equal('This-is-a-Heading-😁-with-a-emoji');
  });
});
