import { ActivityProvider } from '@atlaskit/activity';
import { EmojiProvider } from '@atlaskit/emoji';
import CollabEditProvider from './providers/CollabProvider';
import ContentTransformerProvider from './providers/ContentTransformerProvider';
import MacroProvider from './providers/MacroProvider';
import MediaProvider from './providers/MediaProvider';
import PresenceProvider from './providers/PresenceProvider';
import MentionProvider from './providers/MentionProvider';
import TaskDecisionProvider from './providers/TaskDecisionProvider';

export type Providers = {
  activityProvider: ActivityProvider;
  collabEditProvider: CollabEditProvider;
  presenceProvider: PresenceProvider;
  emojiProvider: EmojiProvider;
  taskDecisionProvider: TaskDecisionProvider;
  // contextIdentifierProvider: ContextIdentifierProvider;

  // legacyImageUploadProvider: ImageUploadHandler;
  mentionProvider: MentionProvider;
  mediaProvider: MediaProvider;
  macroProvider: MacroProvider;
  contentTransformerProvider: ContentTransformerProvider;
};

export type ProviderState<T> =
  | { status: 'READY'; value: T }
  | { status: 'PENDING'; value: PromiseLike<any> }
  | { status: 'ERROR'; value: any }
  | { status: 'EMPTY'; value?: void };
