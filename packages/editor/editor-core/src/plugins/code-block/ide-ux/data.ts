function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

const SELF_CLOSING_BRACKETS = {
  '{': '}',
  '[': ']',
  '(': ')',
};

const LANGUAGE_SELF_CLOSING_BRACKETS = {
  javascript: {
    '"': '"',
    "'": "'",
  },
};

export const completionRules = {
  findClosingBracket(
    openBracket: string,
    language?: string,
  ): string | undefined {
    if (language && LANGUAGE_SELF_CLOSING_BRACKETS[language]) {
      return (
        LANGUAGE_SELF_CLOSING_BRACKETS[language][openBracket] ||
        SELF_CLOSING_BRACKETS[openBracket]
      );
    }
    return SELF_CLOSING_BRACKETS[openBracket];
  },
  findOpeningBracket(closeBracket, language?: string): string | undefined {
    if (language && LANGUAGE_SELF_CLOSING_BRACKETS[language]) {
      return (
        getKeyByValue(LANGUAGE_SELF_CLOSING_BRACKETS[language], closeBracket) ||
        getKeyByValue(SELF_CLOSING_BRACKETS, closeBracket)
      );
    }
    return getKeyByValue(SELF_CLOSING_BRACKETS, closeBracket);
  },
};
