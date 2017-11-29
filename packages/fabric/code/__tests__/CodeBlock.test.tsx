import { shallow } from 'enzyme';
import * as React from 'react';
import CodeBlock from '../src/CodeBlock';

const input = `
  const a = 'foo';
  const b = 'bar';
  const c = [a, b].map(item => item + item);
`;

describe('CodeBlock', () => {
  it('should have "markdown" as default language', () => {
    expect(shallow(<CodeBlock text={input} />).prop('language')).toBe(
      'markdown',
    );
  });

  it('should have "showLineNumbers" enabled by default', () => {
    expect(shallow(<CodeBlock text={input} />).prop('showLineNumbers')).toBe(
      true,
    );
  });
});
