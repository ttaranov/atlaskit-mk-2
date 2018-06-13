import { ResolvedViewProps } from '../ResolvedView';
import { extractPropsFromObject } from './extractPropsFromObject';

export function extractPropsFromDocument(json: any): ResolvedViewProps {
  const props = extractPropsFromObject(json);

  props.icon = {
    url:
      'http://icons.iconarchive.com/icons/everaldo/crystal-clear/128/Action-file-new-icon.png',
  };

  if (json.commentCount) {
    props.details = [
      {
        icon: 'https://www.example.com/icons/comment.png',
        text: String(json.commentCount),
      },
    ];
  }

  return props;
}
