import * as React from 'react';
import { mount } from 'enzyme';
import Link from '../../../../src/renderer/react/marks/link';

describe('Renderer - React/Marks/Link', () => {
  const createLink = () => mount(<Link href="https://www.atlassian.com" target="_blank">This is a link</Link>);

  it('should wrap content with <a>-tag', () => {
    const mark = createLink();
    expect(mark.find('a').length).toEqual(1);
    mark.unmount();
  });

  it('should set href to attrs.href', () => {
    const mark = createLink();
    expect(mark.find('a').props()).toHaveProperty('href', 'https://www.atlassian.com');
    mark.unmount();
  });

  it('should set target to _blank', () => {
    const mark = createLink();
    expect(mark.find('a').props()).toHaveProperty('target', '_blank');
    mark.unmount();
  });

  it('should set target to _blank by default', () => {
    const mark = mount(<Link href="https://www.atlassian.com">This is a link</Link>);
    expect(mark.find('a').props()).toHaveProperty('target', '_blank');
    mark.unmount();
  });

  it('should set target to whatever props.target was', () => {
    const mark = mount(<Link href="https://www.atlassian.com" target="_top">This is a link</Link>);
    expect(mark.find('a').props()).toHaveProperty('target', '_top');
    mark.unmount();
  });

  it('should set safety rel on links with target _blank', () => {
    const mark = createLink();
    expect(mark.find('a').props()).toHaveProperty('rel', 'noreferrer noopener');
    mark.unmount();
  });

  it('should not set safety rel on links with target _blank', () => {
    const mark = mount(<Link href="https://www.atlassian.com" target="_top">This is a link</Link>);
    expect(mark.find('a').props()).not.toHaveProperty('rel');
    mark.unmount();
  });
});
