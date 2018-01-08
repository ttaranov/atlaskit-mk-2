import { MentionsResult } from '../api/MentionResource';

declare var require: {
  <T>(path: string): T;
};

// tslint:disable-next-line:no-var-requires
export const mentionData: MentionsResult = require('./mention-data.json') as MentionsResult;

export const mentionDataSize = mentionData.mentions.length;

export default mentionData;
