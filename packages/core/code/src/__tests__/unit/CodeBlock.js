// @flow
import { mount } from 'enzyme';
import * as React from 'react';
import ThemedCodeBlock, { CodeBlock } from '../../CodeBlock';

const input = `
  const a = 'foo';
  const b = 'bar';
  const c = [a, b].map(item => item + item);
`;

describe('CodeBlock', () => {
  it('should have "clike" as the default language', () => {
    expect(
      mount(<ThemedCodeBlock text={input} />)
        .find(CodeBlock)
        .prop('language'),
    ).toBe('clike');
  });

  it('should have "showLineNumbers" enabled by default', () => {
    expect(
      mount(<ThemedCodeBlock text={input} />)
        .find(CodeBlock)
        .prop('showLineNumbers'),
    ).toBe(true);
  });
});
