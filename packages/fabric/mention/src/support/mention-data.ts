import { MentionsResult } from '../types';

// tslint:disable-next-line:no-var-requires
const mentionData: MentionsResult = require('./json-data/test-mention-data.json') as MentionsResult;

export const mentionDataSize = mentionData.mentions.length;

export default mentionData;
