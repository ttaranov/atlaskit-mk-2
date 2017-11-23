import { expect } from 'chai';
import {
  findMatchedLanguage,
  createLanguageList,
  getLanguageIdentifier,
  DEFAULT_LANGUAGES,
  Language,
} from '../../../src/ui/LanguagePicker/languageList';

describe('@atlaskit/editor-core/ui/LanguagePicker/languageList', () => {
  describe('findMatchedLanguage', () => {
    context('when language is in the list', () => {
      context('when case is not match', () => {
        it('returns matched language', () => {
          expect(findMatchedLanguage(DEFAULT_LANGUAGES, 'jaVasCriPt')!.name).to.eq('JavaScript');
        });
      });

      context('when case is match', () => {
        it('returns matched language', () => {
          expect(findMatchedLanguage(DEFAULT_LANGUAGES, 'JavaScript')!.name).to.eq('JavaScript');
        });
      });
    });

    context('when language is found in alias', () => {
      it('returns the name of the language', () => {
        expect(findMatchedLanguage(DEFAULT_LANGUAGES, 'js')!.name).to.eq('JavaScript');
      });
    });

    context('when language is not in the list', () => {
      it('returns undefined', () => {
        expect(findMatchedLanguage(DEFAULT_LANGUAGES, 'random')).to.eq(undefined);
      });
    });

    context('when language is null', () => {
      it('returns undefined', () => {
        expect(findMatchedLanguage(DEFAULT_LANGUAGES)).to.eq(undefined);
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
      expect(createLanguageList(languages)).to.deep.eq([
        { name: 'AppleScript', alias: ['applescript'] },
        { name: 'C++', alias: ['c++'] },
        { name: 'JavaScript', alias: ['javascript'] },
      ]);
    });
  });

  describe('getLanguageIdentifier', () => {
    it('should use the first alias entry as the id for the language', () => {
      const language: Language = { name: 'JavaScript', alias: ['javascript!', 'js']};
      expect(getLanguageIdentifier(language)).to.eq('javascript!');
    });
  });
});
