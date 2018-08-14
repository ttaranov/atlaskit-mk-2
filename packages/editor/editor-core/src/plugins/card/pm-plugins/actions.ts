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
import { Slice } from 'prosemirror-model';

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
  if (!request) {
    // request has expired
    return false;
  }

  // try to transform to ADF
  const schema = editorState.schema;
  const cardAdf = processRawValue(schema, cardData);

  let tr = editorState.tr;

  if (cardAdf) {
    // replace all the outstanding links with their cards
    tr = request.positions.reduce((tr, unmappedPos) => {
      // remap across the replacement
      const pos = tr.mapping.map(unmappedPos);
      const node = tr.doc.nodeAt(pos);
      if (!node) {
        return tr;
      }

      if (!node.type.isText) {
        return tr;
      }

      // not a link anymore
      const linkMark = node.marks.find(mark => mark.type.name === 'link');
      if (!linkMark) {
        return tr;
      }

      const textSlice = node.text;
      if (linkMark.attrs.href !== url || textSlice !== url) {
        return tr;
      }

      return tr.replaceWith(pos, pos + url.length, cardAdf);
    }, tr);
  }

  // mark as resolved
  tr = tr.setMeta(pluginKey, {
    type: 'RESOLVE',
    url,
  } as Resolve);

  dispatch(tr);
  return true;
};

export const queueCard = (
  url: string,
  pos: number,
  appearance: CardAppearance,
): ((view: EditorView) => Promise<any>) => view => {
  const state = pluginKey.getState(view.state) as CardPluginState | undefined;
  if (!state) {
    return Promise.reject('plugin not enabled');
  }

  if (!state.provider) {
    return Promise.reject('no provider');
  }

  const promise = state.provider.resolve(url, appearance).then(
    resolvedCard => {
      resolve(url, resolvedCard)(view.state, view.dispatch);
      return resolvedCard;
    },
    rejected => {
      view.dispatch(
        view.state.tr.setMeta(pluginKey, {
          type: 'RESOLVE',
          url,
        } as Resolve),
      );
      throw rejected;
    },
  );

  view.dispatch(
    view.state.tr.setMeta(pluginKey, {
      type: 'QUEUE',
      url,
      pos,
    } as Queue),
  );

  return promise;
};

export const queueCardFromSlice = (
  slice: Slice,
  startPos: number,
): ((view: EditorView) => Promise<any>[]) => view => {
  const { state } = view;
  const { schema } = state;

  // if the selection contained the entire document, offset into the first paragraph
  const offset = startPos === 0 ? 1 : 0;

  // dispatch links after we replace selection, otherwise we'll remap early
  const { link } = schema.marks;
  const promises: Promise<any>[] = [];
  slice.content.descendants((node, pos) => {
    const linkMark = node.marks.find(mark => mark.type === link);

    if (linkMark) {
      const docPos = startPos + pos - slice.openStart + offset;
      promises.push(queueCard(linkMark.attrs.href, docPos, 'inline')(view));
      return false;
    }
  });

  return promises;
};

export const setProvider = (cardProvider: CardProvider | null): Command => (
  state,
  dispatch,
) => {
  dispatch(
    state.tr.setMeta(pluginKey, {
      type: 'SET_PROVIDER',
      provider: cardProvider,
    } as SetProvider),
  );
  return true;
};
