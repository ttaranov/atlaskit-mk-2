import { Plugin, PluginKey } from 'prosemirror-state';
import { confluenceJiraIssue } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { nodeViewFactory } from '../../nodeviews';
import ReactJIRAIssueNode from './nodeviews/jira-issue';

export const pluginKey = new PluginKey('jiraIssuePlugin');

const createPlugin = (schema, providerFactory) => {
  return new Plugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceJiraIssue: nodeViewFactory(providerFactory, {
          confluenceJiraIssue: ReactJIRAIssueNode,
        }),
      },
    },
  });
};

const jiraIssuePlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 1400, name: 'confluenceJiraIssue', node: confluenceJiraIssue },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 1410,
        plugin: ({ schema, providerFactory }) =>
          createPlugin(schema, providerFactory),
      },
    ];
  },
};

export default jiraIssuePlugin;
