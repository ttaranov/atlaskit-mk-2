import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Link from '../../../../react/marks/link';

describe('Renderer - React/Marks/Link', () => {
  const createLink = () =>
    mount(
      <Link href="https://www.atlassian.com" target="_blank">
        This is a link
      </Link>,
    );

  it('should wrap content with <a>-tag', () => {
    const mark = createLink();
    expect(mark.find('a').length).to.equal(1);
    mark.unmount();
  });

  it('should set href to attrs.href', () => {
    const mark = createLink();
    expect(mark.find('a').props()).to.have.property(
      'href',
      'https://www.atlassian.com',
    );
    mark.unmount();
  });

  it('should set target to _blank', () => {
    const mark = createLink();
    expect(mark.find('a').props()).to.have.property('target', '_blank');
    mark.unmount();
  });

  it('should not set target by default', () => {
    const mark = mount(
      <Link href="https://www.atlassian.com">This is a link</Link>,
    );
    expect(mark.find('a').props()).to.have.property('target', undefined);
    mark.unmount();
  });

  it('should set target to whatever props.target was', () => {
    const mark = mount(
      <Link href="https://www.atlassian.com" target="_top">
        This is a link
      </Link>,
    );
    expect(mark.find('a').props()).to.have.property('target', '_top');
    mark.unmount();
  });

  it('should set safety rel on links with target _blank', () => {
    const mark = createLink();
    expect(mark.find('a').props()).to.have.property(
      'rel',
      'noreferrer noopener',
    );
    mark.unmount();
  });

  it('should not set safety rel on links with target _blank', () => {
    const mark = mount(
      <Link href="https://www.atlassian.com" target="_top">
        This is a link
      </Link>,
    );
    expect(mark.find('a').props()).to.not.have.property('rel');
    mark.unmount();
  });
});
