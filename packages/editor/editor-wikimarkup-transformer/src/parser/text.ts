// import * as assert from 'assert';
// import { Node as PMNode, NodeType, Schema } from 'prosemirror-model';

// import {
//   SimpleInterval,
//   IntervalWithPMNodes,
//   MacroMatch,
//   RichContentInterval,
// } from '../interfaces';

// import { findUpperLevelMacros, getMacroPM } from './macro';

// // const HEADING = /^h([1|2|3|4|5|6]+)\.\s(.+)/;

// /**
//  * TODO: Converts piece of text into prosemirror nodes array
//  */
// export function intervalToPM(str: string, interval: SimpleInterval): PMNode[] {
//   // const output: any[] = [];
//   // const lines = str.split('\n');

//   // for (let i = 0; i < lines.length; i++) {
//   //   const line = lines[i];

//   //   if (line.startsWith('||') && line.endsWith('||')) {
//   //     // this is a table
//   //     // next lines should start with "|" otherwise - table is finished
//   //   }

//   //   const headingMatches = line.match(HEADING);
//   //   if (headingMatches) {
//   //     output.push({
//   //       type: 'heading',
//   //       attrs: { level: Number(headingMatches[1]) },
//   //       content: [{
//   //         type: 'text',
//   //         // TODO can contain line breaks (\\), marks
//   //         text: headingMatches[2]
//   //       }],
//   //     });
//   //   }

//   // https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
//   // lists

//   // if (line.startsWith('h[number]. ')) {
//   //   // this is a heading
//   // }

//   // if (line.startsWith('bq. ')) {
//   //   // this is a blockquote
//   // }

//   // if (line === '----') {
//   //   // this is a rule
//   // }

//   // TODO empty line
//   // \\ -> replace with a BR
//   // "---" -> —
//   // "--" -> —
//   // [#anchor] -> remove
//   // [^attachment.ext] -> remove
//   // }

//   return [];
// }

// export function intervalsToPM(
//   str: string,
//   intervals: SimpleInterval[],
// ): IntervalWithPMNodes[] {
//   return intervals.map(interval => {
//     const pmNodes = intervalToPM(str, interval);
//     return { ...interval, content: pmNodes };
//   });
// }

// export function findIntervals(
//   macro: SimpleInterval,
//   upperLevelInternalMacros: MacroMatch[],
//   intervals: IntervalWithPMNodes[],
// ): RichContentInterval[] {
//   const output: RichContentInterval[] = [];
//   let position = macro.startPos;

//   while (position < macro.endPos) {
//     const intervalAtPosition = intervals.find(
//       interval => interval.startPos === position,
//     );
//     assert(intervalAtPosition, `No interval found at position ${position}`);

//     const macroAtPosition = upperLevelInternalMacros.find(
//       macro => macro.startPos === position,
//     );

//     if (macroAtPosition) {
//       output.push({
//         startPos: macroAtPosition.startPos,
//         endPos: macroAtPosition.endPos,
//         match: macroAtPosition,
//       });

//       position = macroAtPosition.endPos;
//     } else {
//       output.push(intervalAtPosition!);
//       position = intervalAtPosition!.endPos;
//     }
//   }

//   return output;
// }

// /**
//  * Build Prosemirror tree for macro.
//  * Finds upper level macros for current macro.
//  * Finds intervals not occupied by these upper level macros
//  * Builds PM tree out of these intervals
//  */
// export function buildPMTreeForMacro(
//   wikiMarkup: string,
//   schema: Schema,
//   interval: SimpleInterval,
//   currentPMNode: NodeType,
//   allMatches: MacroMatch[],
//   intervalsWithPMNodes: IntervalWithPMNodes[],
// ): PMNode[] {
//   const upperLevelMacros = findUpperLevelMacros(interval, allMatches);
//   const upperLevelIntervals = findIntervals(
//     interval,
//     upperLevelMacros,
//     intervalsWithPMNodes,
//   );
//   const nodes: PMNode[] = [];

//   for (let i = 0; i < upperLevelIntervals.length; i++) {
//     const interval = upperLevelIntervals[i];
//     let pmNode: PMNode | undefined;

//     if (interval.match) {
//       const { nodeType, attrs } = getMacroPM(schema, interval.match);
//       const content = buildPMTreeForMacro(
//         wikiMarkup,
//         schema,
//         interval.match,
//         nodeType,
//         allMatches,
//         intervalsWithPMNodes,
//       );

//       pmNode = nodeType.createChecked(attrs, content);
//     } else {
//       if (currentPMNode !== schema.nodes.text) {
//         pmNode = schema.nodes.paragraph.createChecked(interval.content);
//       }
//     }

//     if (pmNode) {
//       nodes.push(pmNode);
//     }
//   }

//   return nodes;
// }

// export function combineAll(
//   wikiMarkup: string,
//   schema: Schema,
//   allMatches: MacroMatch[],
//   intervalsWithPMNodes: IntervalWithPMNodes[],
// ): PMNode {
//   const nodes = buildPMTreeForMacro(
//     wikiMarkup,
//     schema,
//     {
//       startPos: 0,
//       endPos: wikiMarkup.length,
//     },
//     schema.nodes.doc,
//     allMatches,
//     intervalsWithPMNodes,
//   );

//   return schema.nodes.doc.createChecked(nodes);
// }
