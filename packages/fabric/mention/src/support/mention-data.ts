import { mention } from '@atlaskit/util-data-test';
import { MentionsResult } from '../types';

const mentionData: MentionsResult = mention.mentionData
  .default as MentionsResult;
export const mentionDataSize = mentionData.mentions.length;

export default mentionData;
