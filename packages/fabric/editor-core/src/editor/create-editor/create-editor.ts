import { Schema, MarkSpec, Mark, Node } from 'prosemirror-model';
import { EditorState, Plugin, Selection } from 'prosemirror-state';
import { sanitizeNodes } from '@atlaskit/editor-common';
import { analyticsService, AnalyticsHandler } from '../../analytics';
import { EditorPlugin, EditorProps, EditorConfig } from '../types';
import { ProviderFactory } from '@atlaskit/editor-common';
import ErrorReporter from '../../utils/error-reporter';
import { name, version } from '../../version';
import { Dispatch } from '../event-dispatcher';

export function sortByRank(a: { rank: number }, b: { rank: number }): number {
  return a.rank - b.rank;
}

export function fixExcludes(marks: {
  [key: string]: MarkSpec;
}): { [key: string]: MarkSpec } {
  const markKeys = Object.keys(marks);
  const markGroups = new Set(markKeys.map(mark => marks[mark].group));

  markKeys.map(markKey => {
    const mark = marks[markKey];
    if (mark.excludes) {
      mark.excludes = mark.excludes
        .split(' ')
        .filter(group => markGroups.has(group))
        .join(' ');
    }
  });
  return marks;
}

export function processPluginsList(
  plugins: EditorPlugin[],
  editorProps: EditorProps,
): EditorConfig {
  return plugins.reduce(
    (acc, plugin) => {
      if (plugin.pmPlugins) {
        acc.pmPlugins.push(...plugin.pmPlugins());
      }

      if (plugin.nodes) {
        acc.nodes.push(...plugin.nodes(editorProps));
      }

      if (plugin.marks) {
        acc.marks.push(...plugin.marks(editorProps));
      }

      if (plugin.contentComponent) {
        acc.contentComponents.push(plugin.contentComponent);
      }

      if (plugin.primaryToolbarComponent) {
        acc.primaryToolbarComponents.push(plugin.primaryToolbarComponent);
      }

      if (plugin.secondaryToolbarComponent) {
        acc.secondaryToolbarComponents.push(plugin.secondaryToolbarComponent);
      }

      return acc;
    },
    {
      nodes: [],
      marks: [],
      pmPlugins: [],
      contentComponents: [],
      primaryToolbarComponents: [],
      secondaryToolbarComponents: [],
    } as EditorConfig,
  );
}

export function createSchema(editorConfig: EditorConfig) {
  const marks = fixExcludes(
    editorConfig.marks.sort(sortByRank).reduce((acc, mark) => {
      acc[mark.name] = mark.mark;
      return acc;
    }, {}),
  );

  const nodes = sanitizeNodes(
    editorConfig.nodes.sort(sortByRank).reduce((acc, node) => {
      acc[node.name] = node.node;
      return acc;
    }, {}),
    marks,
  );

  return new Schema({ nodes, marks });
}

export function createPMPlugins(
  editorConfig: EditorConfig,
  schema: Schema,
  props: EditorProps,
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  errorReporter: ErrorReporter,
): Plugin[] {
  return editorConfig.pmPlugins
    .sort(sortByRank)
    .map(({ plugin }) =>
      plugin({ schema, props, dispatch, providerFactory, errorReporter }),
    )
    .filter(plugin => !!plugin) as Plugin[];
}

export function createErrorReporter(errorReporterHandler) {
  const errorReporter = new ErrorReporter();
  if (errorReporterHandler) {
    errorReporter.handler = errorReporterHandler;
  }
  return errorReporter;
}

export function initAnalytics(analyticsHandler?: AnalyticsHandler) {
  analyticsService.handler = analyticsHandler || (() => {});
  analyticsService.trackEvent('atlassian.editor.start', {
    name,
    version,
  });
}

export const reconfigureState = (
  oldState: EditorState,
  newSchema: Schema,
  newPlugins?: Plugin[],
  newDoc?: Node,
): EditorState => {
  // Since the schema has changed, we need to transform doc/selection/storedMarks ourselves
  // see https://github.com/ProseMirror/prosemirror/issues/754
  const newState = oldState.reconfigure({
    schema: newSchema,
    plugins: newPlugins,
  });
  const doc = newDoc || newSchema.nodeFromJSON(oldState.doc.toJSON());
  const selection = Selection.fromJSON(doc, oldState.selection.toJSON());
  const storedMarks = oldState.storedMarks
    ? oldState.storedMarks.map(mark => Mark.fromJSON(newSchema, mark.toJSON()))
    : undefined;

  doc.check(); // Ensure the new document is valid the with schema
  return Object.assign(newState, { doc, selection, storedMarks });
};
