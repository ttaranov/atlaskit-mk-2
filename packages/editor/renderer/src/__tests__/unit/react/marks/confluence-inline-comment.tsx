import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import ConfluenceInlineComment from '../../../../react/marks/confluence-inline-comment';

describe('Renderer - React/Marks/ConfluenceInlineComment', () => {
  const create = () =>
    mount(
      <ConfluenceInlineComment reference="this-is-reference-hash">
        wrapped text
      </ConfluenceInlineComment>,
    );

  it('should wrap content with <span>-tag', () => {
    const mark = create();
    expect(mark.find('span').length).to.equal(1);
    mark.unmount();
  });

  it('should set data-reference to attrs.reference', () => {
    const mark = create();
    expect(mark.find('span').props()).to.have.property(
      'data-reference',
      'this-is-reference-hash',
    );
    expect(mark.find('span').props()).to.have.property(
      'data-mark-type',
      'confluenceInlineComment',
    );
    mark.unmount();
  });
});
