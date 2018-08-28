import { BlockCard } from '@atlaskit/media-ui';
import { extractPropsFromDocument } from './extractPropsFromDocument';

export function extractPropsFromSpreadsheet(
  json: any,
): BlockCard.ResolvedViewProps {
  const props = extractPropsFromDocument(json);

  props.icon = {
    url:
      'http://icons.iconarchive.com/icons/everaldo/crystal-clear/128/App-spreadsheet-icon.png',
  };

  return props;
}
