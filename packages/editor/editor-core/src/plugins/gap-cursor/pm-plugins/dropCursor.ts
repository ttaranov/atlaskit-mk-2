import * as prosemirrorState from 'prosemirror-state';
import * as prosemirrorView from 'prosemirror-view';

var gecko =
  typeof navigator != 'undefined' && /gecko\/\d/i.test(navigator.userAgent);
var linux =
  typeof navigator != 'undefined' && /linux/i.test(navigator.platform);

export function dropCursor(options) {
  function dispatch(view, data) {
    view.dispatch(view.state.tr.setMeta(plugin, data));
  }

  var timeout: number | undefined = undefined;
  function scheduleRemoval(view) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      if (plugin.getState(view.state)) {
        dispatch(view, { type: 'remove' });
      }
    }, 1000);
  }

  var plugin = new prosemirrorState.Plugin({
    state: {
      init: function init() {
        return null;
      },
      apply: function apply(tr, prev, state) {
        // Firefox on Linux gets really confused an breaks dragging when we
        // mess with the nodes around the target node during a drag. So
        // disable this plugin there. See https://bugzilla.mozilla.org/show_bug.cgi?id=1323170
        if (gecko && linux) {
          return null;
        }
        var command = tr.getMeta(plugin);
        if (!command) {
          return prev;
        }
        if (command.type == 'set') {
          return pluginStateFor(state, command.pos, options, command.view);
        }
        return null;
      },
    },
    props: {
      handleDOMEvents: {
        dragover: function dragover(view, event: any) {
          var active = plugin.getState(view.state);
          var pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (pos) {
            var res = view.state.doc.resolve(pos.pos);
            if (res && res.depth >= 1) {
              var target = res.end(1);
              if (view.dragging) {
                target = dropPos(
                  view.dragging.slice,
                  view.state.doc.resolve(target),
                );
              }
              if (!active || active.pos != target) {
                dispatch(view, { type: 'set', pos: target, view: view });
              }
            }
          }
          scheduleRemoval(view);
          return false;
        },

        dragend: function dragend(view) {
          if (plugin.getState(view.state)) {
            dispatch(view, { type: 'remove' });
          }
          return false;
        },

        drop: function drop(view) {
          if (plugin.getState(view.state)) {
            dispatch(view, { type: 'remove' });
          }
          return false;
        },

        dragleave: function dragleave(view, event) {
          if (event.target == view.dom) {
            dispatch(view, { type: 'remove' });
          }
          return false;
        },
      },
      decorations: function decorations(state) {
        var active = plugin.getState(state);
        return active && active.deco;
      },
    },
  });
  return plugin;
}

function style(options, side) {
  var sty =
    'display: block;background: blue;height: 1px;width: 100%;margin-top: -1px;';
  return sty;
}

function pluginStateFor(state, pos, options, view) {
  var $pos = state.doc.resolve(pos),
    deco;
  // if (!$pos.parent.inlineContent) {
  //   var before, after;
  //   if (before = $pos.nodeBefore)
  //     { deco = prosemirrorView.Decoration.node(pos - before.nodeSize, pos, {nodeName: "div", style: style(options, "right")}); }
  //   else if (after = $pos.nodeAfter)
  //     { deco = prosemirrorView.Decoration.node(pos, pos + after.nodeSize, {nodeName: "div", style: style(options, "left")}); }
  // }
  // if (!deco) {
  var node = document.createElement('span');
  node.textContent = '\u200b';
  node.style.cssText = style(options, 'left') + '; pointer-events: none';
  deco = prosemirrorView.Decoration.widget(pos, node);
  // }
  return {
    pos: pos,
    deco: prosemirrorView.DecorationSet.create(state.doc, [deco]),
  };
}

function dropPos(slice, $pos) {
  if (!slice || !slice.content.size) {
    return $pos.pos;
  }
  var content = slice.content;
  for (var i = 0; i < slice.openStart; i++) {
    content = content.firstChild.content;
  }
  for (var d = $pos.depth; d >= 0; d--) {
    var bias =
      d == $pos.depth
        ? 0
        : $pos.pos <= ($pos.start(d + 1) + $pos.end(d + 1)) / 2 ? -1 : 1;
    var insertPos = $pos.index(d) + (bias > 0 ? 1 : 0);
    if ($pos.node(d).canReplace(insertPos, insertPos, content)) {
      return bias == 0
        ? $pos.pos
        : bias < 0 ? $pos.before(d + 1) : $pos.after(d + 1);
    }
  }
  return $pos.pos;
}
