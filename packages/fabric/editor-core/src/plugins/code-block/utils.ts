export const getTokenArray = codeString => {
  let pos = 0;
  let chr = codeString[0];
  let next1 = codeString[0];
  let prev1;
  let prev2;
  let token = '';
  let tokenType = 0;
  let lastTokenType;
  let multichar;
  const arr: any[] = [];

  while (chr) {
    prev2 = prev1;
    // if previous char is not part of comment and is escape character then
    // it is not used to check if token is completed.
    prev1 = tokenType < 7 && prev1 === '\\' ? 1 : chr;
    chr = next1;
    next1 = codeString[++pos];
    multichar = token.length > 1;

    // checking if token is complete
    if (
      !chr || // end of content
      [
        /\S/.test(chr), // 0: whitespaces
        1, // 1: operators
        1, // 2: braces
        !/[$\w]/.test(chr), // 3: (key)word
        (prev1 === '/' || prev1 === '\n') && multichar, // 4: regex
        prev1 === '"' && multichar, // 5: string with "
        prev1 === "'" && multichar, // 6: string with '
        codeString[pos - 4] + prev2 + prev1 === '-->', // 7: xml comment
        prev2 + prev1 === '*/', // 8: multiline comment
        chr === '\n', // 9: single-line comments end with a newline
        chr === '\n', // 10: single-line comments end with a newline
      ][tokenType]
    ) {
      // appending the token to the result
      if (token) {
        arr.push({ token: token, tokenType: getTokenType(tokenType, token) });
      }
      // saving the previous token type (skipping whitespaces and comments)
      lastTokenType = tokenType && tokenType < 7 ? tokenType : lastTokenType;
      // initializing a new token
      token = '';

      // determining the new token type (going up the
      // list until matching a token type start condition)
      tokenType = 11;
      while (
        ![
          1, //  0: whitespace
          /[\/{}[(\-+*=<>:;|\\.,?!&@~]/.test(chr), //  1: operator or braces
          /[\])]/.test(chr), //  2: closing brace
          /[$\w]/.test(chr), //  3: (key)word
          chr === '/' && //  4: regex
            // previous token was an opening brace or an
            // operator (otherwise division, not a regex)
            lastTokenType < 2 &&
            // workaround for xml closing tags
            prev1 !== '<',
          chr === '"', //  5: string with "
          chr === "'", //  6: string with '
          chr + next1 + codeString[pos + 1] + codeString[pos + 2] === '<!--', //  7: xml comment
          chr + next1 === '/*', //  8: multiline comment
          chr + next1 === '//', //  9: single-line comment
          chr === '#', // 10: hash-style comment
        ][--tokenType]
      ) {}
    }
    token += chr;
  }
  return arr;
};

const getTokenType = (tokenType: number, token: string): string => {
  let tokenCategory = 0;
  if (!tokenType) {
    tokenCategory = 0; // generic
  } else if (tokenType < 3) {
    tokenCategory = 2; // punctuation
  } else if (tokenType > 6) {
    tokenCategory = 4; // comments
  } else if (tokenType > 3) {
    tokenCategory = 3; // regex and strings
  } else {
    // (1 if regexp matches, 0 otherwise)
    tokenCategory = +/^(a(bstract|lias|nd|rguments|rray|s(m|sert)?|uto)|b(ase|egin|ool(ean)?|reak|yte)|c(ase|atch|har|hecked|lass|lone|ompl|onst|ontinue)|de(bugger|cimal|clare|f(ault|er)?|init|l(egate|ete)?)|do|double|e(cho|ls?if|lse(if)?|nd|nsure|num|vent|x(cept|ec|p(licit|ort)|te(nds|nsion|rn)))|f(allthrough|alse|inal(ly)?|ixed|loat|or(each)?|riend|rom|unc(tion)?)|global|goto|guard|i(f|mp(lements|licit|ort)|n(it|clude(_once)?|line|out|stanceof|t(erface|ernal)?)?|s)|l(ambda|et|ock|ong)|m(icrolight|odule|utable)|NaN|n(amespace|ative|ext|ew|il|ot|ull)|o(bject|perator|r|ut|verride)|p(ackage|arams|rivate|rotected|rotocol|ublic)|r(aise|e(adonly|do|f|gister|peat|quire(_once)?|scue|strict|try|turn))|s(byte|ealed|elf|hort|igned|izeof|tatic|tring|truct|ubscript|uper|ynchronized|witch)|t(emplate|hen|his|hrows?|ransient|rue|ry|ype(alias|def|id|name|of))|u(n(checked|def(ined)?|ion|less|signed|til)|se|sing)|v(ar|irtual|oid|olatile)|w(char_t|hen|here|hile|ith)|xor|yield)$/.test(
      token,
    );
  }
  return tokenCategory.toString();
};
