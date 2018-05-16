import { CardViewProps } from '../CardView';
import { extractPropsFromDocument } from './extractPropsFromDocument';

export function extractPropsFromSpreadsheet(json: any): CardViewProps {
  const props = extractPropsFromDocument(json);

  props.icon = {
    url:
      'http://icons.iconarchive.com/icons/everaldo/crystal-clear/128/App-spreadsheet-icon.png',
  };

  return props;
}
