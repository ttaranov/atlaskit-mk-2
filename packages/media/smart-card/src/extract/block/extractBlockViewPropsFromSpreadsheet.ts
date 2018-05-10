import { CardViewProps } from '../../CardView';
import { extractBlockViewPropsFromDocument } from './extractBlockViewPropsFromDocument';

export function extractBlockViewPropsFromSpreadsheet(json: any): CardViewProps {
  const props = extractBlockViewPropsFromDocument(json);

  props.icon = {
    url:
      'http://icons.iconarchive.com/icons/everaldo/crystal-clear/128/App-spreadsheet-icon.png',
  };

  return props;
}
