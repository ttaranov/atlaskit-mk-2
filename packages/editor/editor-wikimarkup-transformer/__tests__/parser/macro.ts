import { calcIntervals, scanMacro } from '../../src/parser/macro';

describe('Macro finder', () => {
  const markup = `
    This is a {quote}simple quote{quote}.
    This is a {quote}{color:red}quote with red color{color}{quote}.
    This is a {quote}quote1{quote}{quote}quote2{quote}
    This is a {noformat}no format thing{noformat}
    This is a {code:xml}<xml_code/>{code}
    This is a {noformat}no format text with {quote}quote inside{quote}{noformat}
  `;

  it('should find macro', () => {
    const matches = scanMacro(markup);

    expect(matches).toEqual([
      { macro: 'quote', startPos: 22, attrs: {}, endPos: 34 },
      { macro: 'quote', startPos: 64, attrs: {}, endPos: 102 },
      { macro: 'color', startPos: 75, attrs: { red: '' }, endPos: 95 },
      { macro: 'quote', startPos: 132, attrs: {}, endPos: 138 },
      { macro: 'quote', startPos: 152, attrs: {}, endPos: 158 },
      { macro: 'noformat', startPos: 190, attrs: {}, endPos: 205 },
      { macro: 'code', startPos: 240, attrs: { xml: '' }, endPos: 251 },
      { macro: 'noformat', startPos: 282, attrs: {}, endPos: 328 },
    ]);
  });

  it('should find intervals', () => {
    calcIntervals(markup, [
      { macro: 'quote', startPos: 22, attrs: {}, endPos: 34 },
      { macro: 'quote', startPos: 64, attrs: {}, endPos: 102 },
      { macro: 'color', startPos: 75, attrs: { red: '' }, endPos: 95 },
      { macro: 'quote', startPos: 132, attrs: {}, endPos: 138 },
      { macro: 'quote', startPos: 152, attrs: {}, endPos: 158 },
      { macro: 'noformat', startPos: 190, attrs: {}, endPos: 205 },
      { macro: 'code', startPos: 240, attrs: { xml: '' }, endPos: 251 },
      { macro: 'noformat', startPos: 282, attrs: {}, endPos: 328 },
    ]);
  });
});
