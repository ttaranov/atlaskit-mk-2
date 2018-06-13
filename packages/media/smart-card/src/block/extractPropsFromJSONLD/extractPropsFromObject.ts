import { ResolvedViewProps } from '../ResolvedView';

export function extractPropsFromObject(json: any): ResolvedViewProps {
  const props: ResolvedViewProps = {
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
