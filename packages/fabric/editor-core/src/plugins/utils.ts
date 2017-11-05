import { InputRule } from 'prosemirror-inputrules';
import { EditorState, Transaction } from 'prosemirror-state';

export type InputRuleHandler = string | ((state: EditorState, match, start, end) => (Transaction | null | undefined));

export function defaultInputRuleHandler(inputRule: InputRule): InputRule {
  const originalHandler = (inputRule as any).handler;
  // TODO: Fix types (ED-2987)
  (inputRule as any).handler = (state: EditorState, match, start, end) => {
    // Skip any input rule inside code
    // https://product-fabric.atlassian.net/wiki/spaces/E/pages/37945345/Editor+content+feature+rules#Editorcontent/featurerules-Rawtextblocks
    if (state.selection.$from.parent.type.spec.code || hasUnsupportedMark(state, start, end)) {
      return;
    }
    return originalHandler(state, match, start, end);
  };
  return inputRule;
}

export function createInputRule(match: RegExp, handler: InputRuleHandler): InputRule {
  return defaultInputRuleHandler(new InputRule(match, handler));
}

// ProseMirror uses the Unicode Character 'OBJECT REPLACEMENT CHARACTER' (U+FFFC) as text representation for
// leaf nodes, i.e. nodes that don't have any content or text property (e.g. hardBreak, emoji, mention, rule)
// It was introduced because of https://github.com/ProseMirror/prosemirror/issues/262
// This can be used in an input rule regex to be able to include or exclude such nodes.
export const leafNodeReplacementCharacter = '\ufffc';

// tslint:disable:no-bitwise
export const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

const hasUnsupportedMark = (state: EditorState, start: number, end: number) => {
  const { doc, schema: { marks }} = state;
  let unsupportedMarksPresent = false;
  doc.nodesBetween(start, end, node => {
    unsupportedMarksPresent = unsupportedMarksPresent || node.marks.filter(
      ({type}) => type === marks.code || type === marks.link
    ).length > 0;
  });
  return unsupportedMarksPresent;
};
