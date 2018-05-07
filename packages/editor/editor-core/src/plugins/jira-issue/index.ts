import { Plugin, PluginKey } from 'prosemirror-state';
import { confluenceJiraIssue } from '@atlaskit/editor-common';
import { EditorPlugin, PMPluginFactory } from '../../types';
import { ReactNodeView } from '../../nodeviews';
import ReactJIRAIssueNode from './nodeviews/jira-issue';

export const pluginKey = new PluginKey('jiraIssuePlugin');

const createPlugin: PMPluginFactory = ({ portalProviderAPI }) => {
  return new Plugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceJiraIssue: ReactNodeView.fromComponent(
          ReactJIRAIssueNode,
          portalProviderAPI,
        ),
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
        plugin: createPlugin,
      },
    ];
  },
};

export default jiraIssuePlugin;
