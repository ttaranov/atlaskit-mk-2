import { EditorServicesConfig } from '../../src';
import { MediaProvider, AuthContext } from '@atlaskit/media-core';
import { MentionResource } from '@atlaskit/mention';
import { name } from '../../package.json';
import { EmojiResource } from '@atlaskit/emoji';

describe(name, () => {
  describe('EditorServicesConfig interface', () => {
    // The following test is non-functional but reinforces the types we import
    // from editor-core and external packages. This file will fail to compile
    // if any of the related packages' APIs change.
    it('should compile with TypeScript.', () => {
      const stubAuthProvider = (context?: AuthContext) => {
        return Promise.resolve({
          clientId: 'e3afd8e5-b7d2-4b8d-bff0-ec86e4b14595',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
        });
      };

      const configInstance: EditorServicesConfig = {
        emojiResourceProvider: function(): Promise<EmojiResource> {
          return Promise.resolve({} as EmojiResource);
        },
        mediaResourceProvider: function(): Promise<MediaProvider> {
          return Promise.resolve({
            uploadParams: {
              collection: 'mock',
            },
            viewContext: Promise.resolve({
              serviceHost: 'http://media-api.host.com',
              authProvider: stubAuthProvider,
            }),
          });
        },
        mentionResourceProvider: function(): Promise<MentionResource> {
          return Promise.resolve({} as MentionResource);
        },
      };

      expect(typeof configInstance).toBe('object');
      expect(configInstance.emojiResourceProvider!() instanceof Promise).toBe(
        true,
      );
      expect(configInstance.mediaResourceProvider!() instanceof Promise).toBe(
        true,
      );
      expect(configInstance.mentionResourceProvider!() instanceof Promise).toBe(
        true,
      );

      return configInstance.mediaResourceProvider!().then(
        (mr: MediaProvider) => {
          expect(typeof mr.uploadParams!.collection).toBe('string');
          expect(mr.viewContext instanceof Promise).toBe(true);
        },
      );
    });
  });
});
