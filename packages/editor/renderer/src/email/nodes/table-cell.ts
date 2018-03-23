import { akColorN50 } from '@atlaskit/util-shared-styles';
import { createTag, serializeStyle } from '../util';
import { NodeSerializerOpts } from '../interfaces';

const css = serializeStyle({
  'background-clip': 'padding-box',
  height: '2.5em',
  'min-width': '3em',
  'vertical-align': 'top',
  border: `1px solid ${akColorN50}`,
  'border-right-width': 0,
  'border-bottom-width': 0,
  padding: '6px 10px',
});

export default function tableCell({ attrs, text }: NodeSerializerOpts) {
  const { colspan, rowspan } = attrs;

  return createTag(
    'td',
    {
      colspan,
      rowspan,
      style: css,
    },
    text,
  );
}
