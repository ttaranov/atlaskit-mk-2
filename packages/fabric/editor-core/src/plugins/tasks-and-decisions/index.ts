import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { AnalyticsDelegateProps } from '@atlaskit/analytics';
import inputRulePlugin from './input-rules';
import keymapsPlugin from './keymaps';
import { taskItemNodeViewFactory, decisionItemNodeView } from '../../nodeviews';

export const stateKey = new PluginKey('tasksAndDecisionsPlugin');

export function createPlugin(analyticDelegateProps: AnalyticsDelegateProps) {
  return new Plugin({
    props: {
      nodeViews: {
        taskItem: taskItemNodeViewFactory(analyticDelegateProps),
        decisionItem: decisionItemNodeView,
      },
    },
    key: stateKey,
  });
}

const plugins = (
  schema: Schema,
  analyticDelegateProps: AnalyticsDelegateProps,
) => {
  return [
    createPlugin(analyticDelegateProps),
    inputRulePlugin(schema),
    keymapsPlugin(schema),
  ].filter(plugin => !!plugin) as Plugin[];
};

export default plugins;
