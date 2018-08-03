import { pluginKey } from './main';
import {
  CardPluginState,
  CardAppearance,
  CardProvider,
  SetProvider,
  Queue,
  Resolve,
} from '../types';
import { Command } from '../../../types';
import { processRawValue } from '../../../utils';
import { EditorView } from 'prosemirror-view';

export const resolve = (url: string, cardData: any): Command => (
  editorState,
  dispatch,
) => {
  // get info we need from state
  const state = pluginKey.getState(editorState) as CardPluginState | undefined;
  if (!state) {
    return false;
  }

  const request = state.requests[url];

  // mark as resolved
  dispatch(
    editorState.tr.setMeta(pluginKey, {
      type: 'RESOLVE',
      url,
    } as Resolve),
  );

  // try to transform to ADF
  const schema = editorState.schema;
  const cardAdf = processRawValue(schema, cardData);

  if (cardAdf) {
    // replace all the outstanding links with their cards
    let tr = editorState.tr;
    request.positions.forEach(pos => {
      const node = tr.doc.nodeAt(pos + 1);
      if (!node) {
        return;
      }

      if (!node.type.isText) {
        return;
      }

      // not a link anymore
      const linkMark = node.marks.find(mark => mark.type.name === 'link');
      if (!linkMark) {
        return;
      }

      // link changed (TODO: no need to check text when we fix hyperlink)
      if (linkMark.attrs.href !== url || node.text !== url) {
        return;
      }

      tr = tr.replaceWith(pos + 1, pos + 1 + node.nodeSize, cardAdf);
    });

    dispatch(tr);
    return true;
  }

  return false;
};

export const queueCard = (
  url: string,
  pos: number,
  appearance: CardAppearance,
): ((view: EditorView) => void) => view => {
  const state = pluginKey.getState(view.state) as CardPluginState | undefined;
  if (!state || !state.provider) {
    return false;
  }

  state.provider.resolve(url, appearance).then(resolvedCard => {
    resolve(url, resolvedCard)(view.state, view.dispatch);
  });

  view.dispatch(
    view.state.tr.setMeta(pluginKey, {
      type: 'QUEUE',
      url,
      pos,
    } as Queue),
  );

  return true;
};

export const setProvider = (cardProvider: CardProvider | null): Command => (
  state,
  dispatch,
) => {
  console.log('setting provider', cardProvider);
  dispatch(
    state.tr.setMeta(pluginKey, {
      type: 'SET_PROVIDER',
      provider: cardProvider,
    } as SetProvider),
  );
  return true;
};
