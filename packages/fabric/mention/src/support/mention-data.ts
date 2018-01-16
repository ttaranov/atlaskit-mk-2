import { MentionsResult } from '../api/MentionResource';

// tslint:disable-next-line:no-var-requires
const mentionData: MentionsResult = require('./test-mention-data.json') as MentionsResult;

export const mentionDataSize = mentionData.mentions.length;

export default mentionData;
