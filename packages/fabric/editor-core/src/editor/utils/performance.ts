import { Plugin } from 'prosemirror-state';

const measureMethod = (obj: object, name: string, prefix?: string) => {
  const originalFn = obj[name];
  const MEASURED_MARK = prefix ? `PM|${prefix}.${name}` : `PM|${name}`;
  const START_MARK = `${MEASURED_MARK}_start`;
  obj[name] = function() {
    performance.mark(START_MARK);
    const startTime = performance.now();
    const result = originalFn.apply(obj, arguments);
    const endTime = performance.now();
    performance.measure(MEASURED_MARK, START_MARK);
    if (endTime - startTime > 10) {
      console.warn(
        `${MEASURED_MARK}: Took ${Math.ceil(
          endTime - startTime,
        )}ms to complete.`,
      );
    }
    return result;
  };
};

const patchPluginWithUserTimings = (name: string, plugin: Plugin) => {
  Object.keys(plugin.props)
    .filter(key => typeof plugin.props[key] === 'function')
    .forEach(key => measureMethod(plugin.props, key, `${name}.props`));

  return plugin;
};

export const profileProsemirrorPlugins = (plugins: Plugin[]) => {
  plugins.forEach((plugin, index) => {
    const name = plugin.spec['key']
      ? plugin.spec['key'].key
      : `unknownPlugin-${index}`;
    patchPluginWithUserTimings(name, plugin);
  });
};

// export const measure = (plugin: PluginSpec) => {
//   const name = plugin.key || `unknownPlugin-?`;
//   if (plugin.props) {
//     Object.keys(plugin.props)
//     .filter(key => typeof plugin.props![key] === 'function')
//     .forEach(key => measureMethod(plugin.props!, key, `${name}.props`));
//   }

//   if (plugin.view) {
//     const originalPluginView = plugin.view;
//     plugin.view = (editorView: EditorView) => {
//       const result = originalPluginView(editorView);
//       if (result.update) {
//         measureMethod(result, 'update', `${name}.view`);
//       }
//       return result;
//     }
//   }

//   return plugin;
// };
