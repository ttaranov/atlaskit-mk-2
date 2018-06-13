import {
  findMatchedLanguage,
  createLanguageList,
  getLanguageIdentifier,
  DEFAULT_LANGUAGES,
  Language,
} from '../../../../src/plugins/code-block/ui/LanguagePicker/languageList';

describe('@atlaskit/editor-core/ui/LanguagePicker/languageList', () => {
  describe('findMatchedLanguage', () => {
    describe('when language is in the list', () => {
      describe('when case is not match', () => {
        it('returns matched language', () => {
          expect(
            findMatchedLanguage(DEFAULT_LANGUAGES, 'jaVasCriPt')!.name,
          ).toEqual('JavaScript');
        });
      });

      describe('when case is match', () => {
        it('returns matched language', () => {
          expect(
            findMatchedLanguage(DEFAULT_LANGUAGES, 'JavaScript')!.name,
          ).toEqual('JavaScript');
        });
      });
    });

    describe('when language is found in alias', () => {
      it('returns the name of the language', () => {
        expect(findMatchedLanguage(DEFAULT_LANGUAGES, 'js')!.name).toEqual(
          'JavaScript',
        );
      });
    });

    describe('when language is not in the list', () => {
      it('returns undefined', () => {
        expect(findMatchedLanguage(DEFAULT_LANGUAGES, 'random')).toBe(
          undefined,
        );
      });
    });

    describe('when language is null', () => {
      it('returns undefined', () => {
        expect(findMatchedLanguage(DEFAULT_LANGUAGES)).toBe(undefined);
      });
    });
  });

  describe('createLanguageList', () => {
    it('returns a sorted language list', () => {
      const languages: Language[] = [
        { name: 'JavaScript', alias: ['javascript'] },
        { name: 'AppleScript', alias: ['applescript'] },
        { name: 'C++', alias: ['c++'] },
      ];
      expect(createLanguageList(languages)).toEqual([
        { name: 'AppleScript', alias: ['applescript'] },
        { name: 'C++', alias: ['c++'] },
        { name: 'JavaScript', alias: ['javascript'] },
      ]);
    });
  });

  describe('getLanguageIdentifier', () => {
    it('should use the first alias entry as the id for the language', () => {
      const language: Language = {
        name: 'JavaScript',
        alias: ['javascript!', 'js'],
      };
      expect(getLanguageIdentifier(language)).toEqual('javascript!');
    });
  });
});
