import { Node as PMNode, Schema } from 'prosemirror-model';

import { Interval, IntervalWithPMNodes, MacroMatch } from '../interfaces';

// const HEADING = /^h([1|2|3|4|5|6]+)\.\s(.+)/;

/**
 * TODO: Converts piece of text into prosemirror nodes array
 */
export function intervalToPM(str: string, interval: Interval): PMNode[] {
  // const output: any[] = [];
  // const lines = str.split('\n');

  // for (let i = 0; i < lines.length; i++) {
  //   const line = lines[i];

  //   if (line.startsWith('||') && line.endsWith('||')) {
  //     // this is a table
  //     // next lines should start with "|" otherwise - table is finished
  //   }

  //   const headingMatches = line.match(HEADING);
  //   if (headingMatches) {
  //     output.push({
  //       type: 'heading',
  //       attrs: { level: Number(headingMatches[1]) },
  //       content: [{
  //         type: 'text',
  //         // TODO can contain line breaks (\\), marks
  //         text: headingMatches[2]
  //       }],
  //     });
  //   }

  // https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
  // lists

  // if (line.startsWith('h[number]. ')) {
  //   // this is a heading
  // }

  // if (line.startsWith('bq. ')) {
  //   // this is a blockquote
  // }

  // if (line === '----') {
  //   // this is a rule
  // }

  // TODO empty line
  // \\ -> replace with a BR
  // "---" -> —
  // "--" -> —
  // [#anchor] -> remove
  // [^attachment.ext] -> remove
  // }

  return [];
}

export function intervalsToPM(
  str: string,
  intervals: Interval[],
): IntervalWithPMNodes[] {
  return intervals.map(interval => {
    const pmNodes = intervalToPM(str, interval);
    return { ...interval, content: pmNodes };
  });
}

/**
 * TODO: Converts macros matches and intervals into final PM tree
 */
export function combineAll(
  schema: Schema,
  macro: MacroMatch[],
  intervalsWithPMNodes: IntervalWithPMNodes[],
): PMNode {
  return schema.nodes.doc.createChecked({});
}
