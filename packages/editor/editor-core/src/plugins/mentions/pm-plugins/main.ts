import { Fragment, Node, Slice } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  MentionProvider,
  MentionDescription,
  isSpecialMention,
} from '@atlaskit/mention';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  isMarkTypeAllowedInCurrentSelection,
  isChromeWithSelectionBug,
} from '../../../utils';
import { analyticsService } from '../../../analytics';
import mentionNodeView from '../nodeviews/mention';
import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

export const mentionPluginKey: PluginKey = new PluginKey('mentionPlugin');

export type MentionsStateSubscriber = (state: MentionsState) => any;
export type StateChangeHandler = (state: MentionsState) => any;
export type ProviderChangeHandler = (provider?: MentionProvider) => any;

interface QueryMark {
  start: number;
  end: number;
  query: string;
}

function findMentionQueryMarks(
  state: EditorState,
  active: boolean = true,
  start: number = 0,
  end?: number,
): QueryMark[] {
  const { doc, schema } = state;
  const { mentionQuery } = schema.marks;

  const marks: QueryMark[] = [];
  doc.nodesBetween(start, end || doc.nodeSize - 2, (node, pos) => {
    let mark = mentionQuery.isInSet(node.marks);
    if (mark) {
      const query = node.textContent.substr(1).trim();
      if ((active && mark.attrs.active) || (!active && !mark.attrs.active)) {
        marks.push({
          start: pos,
          end: pos + node.textContent.length,
          query,
        });
      }

      return false;
    }

    return true;
  });

  return marks;
}

export class MentionsState {
  // public state
  query?: string;
  lastQuery?: string;
  queryActive: boolean = false;
  enabled: boolean = true;
  focused: boolean = true;
  anchorElement?: HTMLElement;
  mentionProvider?: MentionProvider;

  onSelectPrevious = (): boolean => false;
  onSelectNext = (): boolean => false;
  onSelectCurrent = (key?: string): boolean => false;
  onDismiss = (): void => {};
  onSpaceTyped = (): void => {};

  private changeHandlers: StateChangeHandler[] = [];
  private state: EditorState;
  private view: EditorView;
  private dirty;
  private currentQueryResult?: MentionDescription[];
  private queryResults: Map<string, MentionDescription>;
  private tokens: Map<string, QueryMark>;
  private previousQueryResultCount: number;

  constructor(state: EditorState, providerFactory: ProviderFactory) {
    this.changeHandlers = [];
    this.state = state;
    this.dirty = false;
    this.queryResults = new Map();
    this.tokens = new Map();
    this.previousQueryResultCount = -1;

    providerFactory.subscribe('mentionProvider', this.handleProvider);
  }

  subscribe(cb: MentionsStateSubscriber) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: MentionsStateSubscriber) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  notifySubscribers() {
    this.changeHandlers.forEach(cb => cb(this));
  }

  apply(tr: Transaction, state: EditorState) {
    if (!this.mentionProvider) {
      return;
    }

    const { mentionQuery } = state.schema.marks;
    const { doc, selection } = state;
    const { from, to } = selection;

    this.dirty = false;

    const newEnabled = this.isEnabled(state);
    if (newEnabled !== this.enabled) {
      this.enabled = newEnabled;
      this.dirty = true;
    }

    const hasActiveQueryNode = node => {
      const mark = mentionQuery.isInSet(node.marks);
      return mark && mark.attrs.active;
    };

    if (this.rangeHasNodeMatchingQuery(doc, from - 1, to, hasActiveQueryNode)) {
      if (!this.queryActive) {
        this.dirty = true;
        this.queryActive = true;
      }

      const { nodeBefore } = selection.$from;
      const newQuery = ((nodeBefore && nodeBefore.textContent) || '').substr(1);

      if (this.query !== newQuery) {
        this.dirty = true;
        this.query = newQuery;
        if (newQuery.length === 0) {
          this.currentQueryResult = undefined;
        }
      }
    } else if (this.queryActive) {
      this.dirty = true;
      return;
    }

    if (this.dirty) {
      this.notifySubscribers();
    }
  }

  update(state: EditorState) {
    this.state = state;

    if (!this.mentionProvider) {
      return;
    }

    const { mentionQuery } = state.schema.marks;
    const { doc, selection } = state;
    const { from, to } = selection;
    if (!doc.rangeHasMark(from - 1, to, mentionQuery) && this.queryActive) {
      this.dismiss();
    }

    const mark = findMentionQueryMarks(this.state, true, from - 1, to).pop();
    if (!mark && this.queryActive) {
      this.dismiss();
    }

    const domRef = mark ? this.view.domAtPos(mark.start) : undefined;
    const newAnchorElement = domRef
      ? ((domRef.node as HTMLElement).childNodes[domRef.offset] as HTMLElement)
      : undefined;

    if (newAnchorElement !== this.anchorElement) {
      this.dirty = true;
      this.anchorElement = newAnchorElement;
    }

    if (this.dirty) {
      this.notifySubscribers();
    }
  }

  private rangeHasNodeMatchingQuery(
    doc,
    from,
    to,
    query: (node: Node) => boolean,
  ) {
    let found = false;
    doc.nodesBetween(from, to, node => {
      if (query(node)) {
        found = true;
      }
    });

    return found;
  }

  dismiss(): boolean {
    const transaction = this.generateDismissTransaction();
    if (transaction) {
      const { view } = this;
      view.dispatch(transaction);
    }
    this.onDismiss();
    return true;
  }

  generateDismissTransaction(tr?: Transaction): Transaction {
    this.clearState();

    const { state } = this;

    const currentTransaction = tr ? tr : state.tr;
    if (state) {
      const { schema } = state;
      const markType = schema.mark('mentionQuery');
      const { start, end } = this.findActiveMentionQueryMark();

      return currentTransaction
        .removeMark(start, end, markType)
        .removeStoredMark(markType);
    }

    return currentTransaction;
  }

  isEnabled(state?: EditorState) {
    const currentState = state ? state : this.state;
    const { mentionQuery } = currentState.schema.marks;
    return isMarkTypeAllowedInCurrentSelection(mentionQuery, currentState);
  }

  private findActiveMentionQueryMark() {
    const activeMentionQueryMarks = findMentionQueryMarks(this.state, true);
    let from = this.state.selection.from;
    let closestMark = { start: -1, end: -1, query: '' };
    let closestDistance = Infinity;
    activeMentionQueryMarks.forEach(mark => {
      const distance = Math.min(
        Math.abs(from - mark!.start),
        Math.abs(from - mark!.end),
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMark = mark;
      }
    });

    return closestMark;
  }

  insertMention(mentionData?: MentionDescription, queryMark?: { start; end }) {
    const { view } = this;
    const tr = this.generateInsertMentionTransaction(mentionData, queryMark);

    // This problem affects Chrome v58-62. See: https://github.com/ProseMirror/prosemirror/issues/710
    if (isChromeWithSelectionBug) {
      document.getSelection().empty();
    }

    view.dispatch(tr);
  }

  generateInsertMentionTransaction(
    mentionData?: MentionDescription,
    queryMark?: { start; end },
    tr?: Transaction,
  ): Transaction {
    const { state } = this;
    const { mention } = state.schema.nodes;
    const currentTransaction = tr ? tr : state.tr;

    if (mention && mentionData) {
      const activeMentionQueryMark = this.findActiveMentionQueryMark();
      const { start, end } = queryMark ? queryMark : activeMentionQueryMark;
      const { id, name, nickname, accessLevel, userType } = mentionData;
      const renderName = nickname ? nickname : name;
      const nodes = [
        mention.create({
          text: `@${renderName}`,
          id,
          accessLevel,
          userType: userType === 'DEFAULT' ? null : userType,
        }),
      ];
      if (!this.isNextCharacterSpace(end, currentTransaction.doc)) {
        nodes.push(state.schema.text(' '));
      }
      this.clearState();

      let transaction = currentTransaction;
      if (activeMentionQueryMark.end !== end) {
        const mentionMark = state.schema.mark('mentionQuery', { active: true });
        transaction = transaction.removeMark(
          end,
          activeMentionQueryMark.end,
          mentionMark,
        );
      }
      transaction = transaction.replaceWith(start, end, nodes);

      return transaction;
    } else {
      return this.generateDismissTransaction(currentTransaction);
    }
  }

  isNextCharacterSpace(position: number, doc) {
    try {
      const resolvedPosition = doc.resolve(position);
      return (
        resolvedPosition.nodeAfter &&
        resolvedPosition.nodeAfter.textContent.indexOf(' ') === 0
      );
    } catch (e) {
      return false;
    }
  }

  handleProvider = (name: string, provider: Promise<any>): void => {
    switch (name) {
      case 'mentionProvider':
        this.setMentionProvider(provider);
        break;
    }
  };

  setMentionProvider(
    provider?: Promise<MentionProvider>,
  ): Promise<MentionProvider> {
    return new Promise<MentionProvider>((resolve, reject) => {
      if (provider && provider.then) {
        provider
          .then(mentionProvider => {
            if (this.mentionProvider) {
              this.mentionProvider.unsubscribe('editor-mentionpicker');
              this.currentQueryResult = undefined;
            }

            this.mentionProvider = mentionProvider;
            this.mentionProvider.subscribe(
              'editor-mentionpicker',
              undefined,
              undefined,
              undefined,
              this.onMentionResult,
            );

            // Improve first mentions performance by establishing a connection and populating local search
            this.mentionProvider.filter('');
            resolve(mentionProvider);
          })
          .catch(() => {
            this.mentionProvider = undefined;
          });
      } else {
        this.mentionProvider = undefined;
      }
    });
  }

  trySelectCurrent(key?: string) {
    const currentQuery = this.query ? this.query.trim() : '';
    const mentions: MentionDescription[] = this.currentQueryResult
      ? this.currentQueryResult
      : [];
    const mentionsCount = mentions.length;
    this.tokens.set(currentQuery, this.findActiveMentionQueryMark());

    if (!this.mentionProvider) {
      return false;
    }

    const queryInFlight = this.mentionProvider.isFiltering(currentQuery);

    if (!queryInFlight && mentionsCount === 1) {
      this.onSelectCurrent(key);
      return true;
    }

    // No results for the current query OR no results expected because previous subquery didn't return anything
    if (
      (!queryInFlight && mentionsCount === 0) ||
      this.previousQueryResultCount === 0
    ) {
      const match: boolean = this.tryInsertingPreviousMention();
      analyticsService.trackEvent('atlassian.fabric.mention.insert.auto', {
        match,
      });
    }

    if (!this.query) {
      this.dismiss();
    }

    this.onSpaceTyped();
    return false;
  }

  tryInsertingPreviousMention(): boolean {
    let mentionInserted = false;
    this.tokens.forEach((value, key) => {
      const match = this.queryResults.get(key);
      if (match) {
        this.insertMention(match, value);
        this.tokens.delete(key);
        mentionInserted = true;
      }
    });

    if (!mentionInserted) {
      this.dismiss();
    }
    return mentionInserted;
  }

  onMentionResult = (mentions: MentionDescription[], query: string) => {
    if (!query) {
      return;
    }

    if (query.length > 0 && query === this.query) {
      this.currentQueryResult = mentions;
    }

    const match = this.findExactMatch(query, mentions);
    if (match) {
      this.queryResults.set(query, match);
    }

    if (this.isSubQueryOfCurrentQuery(query)) {
      this.previousQueryResultCount = mentions.length;
    }
  };

  private isSubQueryOfCurrentQuery(query: string) {
    return (
      this.query &&
      this.query.indexOf(query) === 0 &&
      !this.mentionProvider!.isFiltering(query)
    );
  }

  private findExactMatch(
    query: string,
    mentions: MentionDescription[],
  ): MentionDescription | null {
    let filteredMentions = mentions.filter(mention => {
      if (
        mention.nickname &&
        mention.nickname.toLocaleLowerCase() === query.toLocaleLowerCase()
      ) {
        return mention;
      }
    });

    if (filteredMentions.length > 1) {
      filteredMentions = filteredMentions.filter(mention =>
        isSpecialMention(mention),
      );
    }

    return filteredMentions.length === 1 ? filteredMentions[0] : null;
  }

  private clearState() {
    this.queryActive = false;
    this.lastQuery = this.query;
    this.query = undefined;
    this.tokens.clear();
    this.previousQueryResultCount = -1;
  }

  setView(view: EditorView) {
    this.view = view;
  }

  insertMentionQuery = () => {
    const { state } = this.view;
    const node = state.schema.text('@', [state.schema.mark('mentionQuery')]);
    this.view.dispatch(
      state.tr.replaceSelection(new Slice(Fragment.from(node), 0, 0)),
    );
    if (!this.view.hasFocus()) {
      this.view.focus();
    }
  };

  updateEditorFocused(focused: boolean) {
    this.focused = focused;
    this.notifySubscribers();
  }
}

export function createPlugin(
  portalProviderAPI: PortalProviderAPI,
  providerFactory: ProviderFactory,
) {
  return new Plugin({
    state: {
      init(config, state) {
        return new MentionsState(state, providerFactory);
      },
      apply(tr, prevPluginState, oldState, newState) {
        // NOTE: Don't replace the pluginState here.
        prevPluginState.apply(tr, newState);
        return prevPluginState;
      },
    },
    props: {
      nodeViews: {
        mention: ReactNodeView.fromComponent(
          mentionNodeView,
          portalProviderAPI,
          { providerFactory },
        ),
      },
      handleDOMEvents: {
        focus(view: EditorView, event) {
          mentionPluginKey.getState(view.state).updateEditorFocused(true);
          return false;
        },
        blur(view: EditorView, event) {
          mentionPluginKey.getState(view.state).updateEditorFocused(false);
          return false;
        },
      },
    },
    key: mentionPluginKey,
    view: (view: EditorView) => {
      const pluginState: MentionsState = mentionPluginKey.getState(view.state);
      pluginState.setView(view);

      return {
        update(view: EditorView, prevState: EditorState) {
          pluginState.update(view.state);
        },
        destroy() {
          providerFactory.unsubscribe(
            'mentionProvider',
            pluginState.handleProvider,
          );
        },
      };
    },
    appendTransaction: (transactions, oldState, newState) => {
      return findMentionQueryMarks(newState, true).reduce(
        (currentTr: Transaction | null, queryMark: QueryMark) => {
          const doc = currentTr ? currentTr.doc : newState.doc;
          const { start, end } = queryMark;

          if (
            !doc
              .textBetween(start, end)
              .trim()
              .startsWith('@')
          ) {
            let newTr = currentTr ? currentTr : newState.tr;
            newTr = newTr.removeMark(
              start,
              end,
              newState.schema.marks.mentionQuery,
            );
            newTr.setMeta('addToHistory', false);
            return newTr;
          } else {
            return currentTr;
          }
        },
        null,
      );
    },
  });
}

export interface Mention {
  name: string;
  mentionName: string;
  nickname?: string;
  id: string;
}
