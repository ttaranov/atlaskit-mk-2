import { pluginKey } from './main';
import {
  CardPluginState,
  CardAppearance,
  CardProvider,
  CardPluginAction,
} from '../types';
import { Command } from '../../../types';
import { processRawValue } from '../../../utils';
import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';

const cardAction = (tr, action: CardPluginAction) => {
  return tr.setMeta(pluginKey, action);
};

export const resolveWithCardData = (url: string, cardData: any): Command => (
  editorState,
  dispatch,
) => {
  const state = pluginKey.getState(editorState) as CardPluginState | undefined;
  if (!state) {
    return false;
  }

  const requests = state.requests.filter(req => req.url === url);

  // try to transform to ADF
  const schema = editorState.schema;
  const cardAdf = processRawValue(schema, cardData);

  let tr = editorState.tr;
  if (cardAdf) {
    requests.forEach(request => {
      // replace all the outstanding links with their cards
      const pos = tr.mapping.map(request.pos);
      const node = tr.doc.nodeAt(pos);
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

      const textSlice = node.text;
      if (linkMark.attrs.href !== url || textSlice !== url) {
        return;
      }

      tr.replaceWith(pos, pos + url.length, cardAdf);
    });
  }

  // mark as resolved
  dispatch(
    cardAction(tr, {
      type: 'RESOLVE',
      url,
    }),
  );

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
      resolveWithCardData(url, resolvedCard)(view.state, view.dispatch);
      return resolvedCard;
    },
    rejected => {
      view.dispatch(
        cardAction(view.state.tr, {
          type: 'RESOLVE',
          url,
        }),
      );
      throw rejected;
    },
  );

  view.dispatch(
    cardAction(view.state.tr, {
      type: 'QUEUE',
      url,
      pos,
      appearance,
    }),
  );

  return promise;
};

const getStepRange = (
  transaction: Transaction,
): { from: number; to: number } | null => {
  let from = -1;
  let to = -1;

  transaction.steps.forEach(step => {
    step.getMap().forEach((_oldStart, _oldEnd, newStart, newEnd) => {
      from = newStart < from || from === -1 ? newStart : from;
      to = newEnd < to || to === -1 ? newEnd : to;
    });
  });

  if (from !== -1) {
    return { from, to };
  }

  return null;
};

export const queueCardFromTr = (
  tr: Transaction,
): ((view: EditorView) => Promise<any>[]) => view => {
  const { state } = view;
  const { schema } = state;

  // dispatch links after we replace selection, otherwise we'll remap early
  const { link } = schema.marks;
  const promises: Promise<any>[] = [];

  const stepRange = getStepRange(tr);
  if (!stepRange) {
    return [];
  }

  tr.doc.nodesBetween(stepRange.from, stepRange.to, (node, pos) => {
    if (!node.isText) {
      return true;
    }

    const linkMark = node.marks.find(mark => mark.type === link);

    if (linkMark) {
      // don't bother queueing nodes that have user-defined text for a link
      if (node.text !== linkMark.attrs.href) {
        return false;
      }

      promises.push(queueCard(linkMark.attrs.href, pos, 'inline')(view));
    }

    return false;
  });

  return promises;
};

export const setProvider = (cardProvider: CardProvider | null): Command => (
  state,
  dispatch,
) => {
  dispatch(
    cardAction(state.tr, {
      type: 'SET_PROVIDER',
      provider: cardProvider,
    }),
  );
  return true;
};
