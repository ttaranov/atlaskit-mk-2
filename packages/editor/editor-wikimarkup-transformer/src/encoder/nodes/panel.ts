import { Node as PMNode } from 'prosemirror-model';
import { encode, NodeEncoder } from '..';

const panelTypeColorMapping = {
  info: '#deebff',
  note: '#eae6ff',
  tip: '#e3fcef',
  warning: '#fffae6',
};

export const panel: NodeEncoder = (node: PMNode): string => {
  const result: string[] = [];
  node.forEach(n => {
    result.push(encode(n));
  });
  return `{panel:bgColor=${panelTypeColorMapping[node.attrs.panelType] || ''}}
${result.join('\n\n')}
{panel}`;
};
