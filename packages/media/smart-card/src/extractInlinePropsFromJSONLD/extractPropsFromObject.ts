import { InlineCard } from '@atlaskit/media-ui';

export function extractPropsFromObject(
  json: any,
): InlineCard.ResolvedViewProps {
  if (!json) {
    throw new Error('smart-card: data is not parsable JSON-LD.');
  }

  const props: InlineCard.ResolvedViewProps = {
    title: typeof json.name === 'string' ? json.name : '',
  };

  if (json.generator && json.generator.icon) {
    props.icon = json.generator.icon;
  }

  return props;
}
