import { BlockCard } from '@atlaskit/media-ui';

export function extractPropsFromObject(json: any): BlockCard.ResolvedViewProps {
  const props: BlockCard.ResolvedViewProps = {
    title: {
      text: typeof json.name === 'string' ? json.name : '',
    },
    description: {
      text: typeof json.summary === 'string' ? json.summary : '',
    },
  };

  if (!json) {
    return props;
  }

  if (json.url) {
    props.link = String(json.url);
  }

  if (json.generator && (json.generator.name || json.generator.icon)) {
    props.context = {
      text: json.generator.name,
      icon: json.generator.icon,
    };
  }

  return props;
}
