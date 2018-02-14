import MentionResource, {
  AbstractMentionResource,
  MentionProvider,
} from './api/MentionResource';
import PresenceResource, {
  PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import MentionItem from './components/MentionItem';
import MentionList from './components/MentionList';
import ResourcedMentionList from './components/ResourcedMentionList';
import MentionPicker from './components/MentionPicker';
import Mention from './components/Mention';
import ResourcedMention from './components/Mention/ResourcedMention';
import { MentionDescription, MentionsResult, isSpecialMention } from './types';
import { SearchIndex } from './util/searchIndex';
import { testData, storyData } from './support';
import * as support from './support';

export {
  // Classes
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
  // Components
  MentionItem,
  MentionList,
  ResourcedMentionList,
  MentionPicker,
  Mention,
  ResourcedMention,
  // Functions
  isSpecialMention,
  // Support data
  support,
  testData,
  storyData,
};

export default MentionPicker;
