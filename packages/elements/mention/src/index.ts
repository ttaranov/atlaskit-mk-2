import MentionResource, {
  AbstractMentionResource,
  MentionContextIdentifier,
  MentionProvider,
  MentionStats,
} from './api/MentionResource';
import PresenceResource, {
  PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import MentionItem from './components/MentionItem';
import MentionList from './components/MentionList';
import ResourcedMentionList from './components/ResourcedMentionList';
import { MentionPickerWithAnalytics as MentionPicker } from './components/MentionPicker';
import Mention from './components/Mention';
import ResourcedMention from './components/Mention/ResourcedMention';
import { MentionDescription, MentionsResult, isSpecialMention } from './types';
import { SearchIndex } from './util/searchIndex';
import { ELEMENTS_CHANNEL } from './constants';
import ContextMentionResource from './api/ContextMentionResource';

export {
  // Classes
  ContextMentionResource,
  MentionResource,
  PresenceResource,
  AbstractMentionResource,
  AbstractPresenceResource,
  SearchIndex,
  // Interfaces
  MentionProvider,
  PresenceProvider,
  MentionDescription,
  MentionsResult,
  // types
  MentionContextIdentifier,
  MentionStats,
  // Components
  MentionItem,
  MentionList,
  ResourcedMentionList,
  MentionPicker,
  Mention,
  ResourcedMention,
  // Functions
  isSpecialMention,
  // Constants
  ELEMENTS_CHANNEL,
};

export default MentionPicker;
