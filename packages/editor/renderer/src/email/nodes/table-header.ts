import { colors } from '@atlaskit/theme';
import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const baseStyle = {
  'background-color': colors.N20,
  'background-clip': 'padding-box',
  border: `1px solid ${colors.N50}`,
  'border-right-width': 0,
  'border-bottom-width': 0,
  'font-weight': 'bold',
  height: '2.5em',
  'min-width': '3em',
  padding: '6px 10px',
  'text-align': 'left',
  'vertical-align': 'top',
};

export default function tableHeader({ attrs, text }: NodeSerializerOpts) {
  const { colspan, rowspan, background } = attrs;
  const style = serializeStyle({
    ...baseStyle,
    'background-color': background ? background : baseStyle['background-color'],
  });

  return createTag(
    'th',
    {
      colspan,
      rowspan,
      style,
    },
    text,
  );
}
