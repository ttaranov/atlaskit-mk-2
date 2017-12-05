import { inputRules } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { analyticsService } from '../../analytics';
import { createInputRule, leafNodeReplacementCharacter } from '../utils';

const availablePanelTypes = ['info', 'note', 'tip', 'warning'];

export function inputRulePlugin(schema: Schema): Plugin | undefined {
  const panelInputRule = createInputRule(
    /^\{(\S+)\}$/,
    (
      state: EditorState,
      match: Object | undefined,
      start: number,
      end: number,
    ) => {
      const panelType = match && match[1];

      if (panelType && availablePanelTypes.indexOf(panelType) >= 0) {
        const { schema } = state;
        let { tr } = state;
        const { panel } = schema.nodes;
        if (panel) {
          const { $from } = state.selection;
          let range = $from.blockRange($from)!;
          tr = tr.wrap(range, [{ type: panel, attrs: { panelType } }]);
          tr = tr.delete(end - (panelType.length + 2), end + 1);

          analyticsService.trackEvent(
            `atlassian.editor.format.panel.${panelType}.autoformatting`,
          );

          return tr;
        }
      }
    },
    true,
  );

  const panelInputRuleSoftEnter = createInputRule(
    new RegExp(`${leafNodeReplacementCharacter}\\{(\\S+)\\}$`),
    (
      state: EditorState,
      match: Object | undefined,
      start: number,
      end: number,
    ): Transaction | undefined => {
      const panelType = match && match[1];

      if (panelType && availablePanelTypes.indexOf(panelType) >= 0) {
        analyticsService.trackEvent(
          `atlassian.editor.format.panel.${panelType}.autoformatting`,
        );

        let tr = state.tr.delete(start, end).split(start);
        const position = tr.doc.resolve(start + 2);
        let range = position.blockRange(position)!;
        const { panel } = state.schema.nodes;
        tr = tr.wrap(range, [{ type: panel, attrs: { panelType } }]);
        return tr;
      }
    },
    true,
  );

  return inputRules({ rules: [panelInputRule, panelInputRuleSoftEnter] });
}

export default inputRulePlugin;
