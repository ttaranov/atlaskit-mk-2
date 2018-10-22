import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';

export function extractPropsFromObject(json: any): InlineCardResolvedViewProps {
  if (!json) {
    throw new Error('smart-card: data is not parsable JSON-LD.');
  }

  const props: InlineCardResolvedViewProps = {
    title: typeof json.name === 'string' ? json.name : '',
  };

  if (json.generator && json.generator.icon) {
    props.icon = json.generator.icon;
  }

  return props;
}
