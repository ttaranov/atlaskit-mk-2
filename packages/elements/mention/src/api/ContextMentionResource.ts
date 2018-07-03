// @ts-ignore: unused variable
import MentionResource, {
  MentionProvider,
  MentionContextIdentifiers,
  ResultCallback,
  InfoCallback,
  ErrorCallback,
} from './MentionResource';
// @ts-ignore: unused variable
import { MentionDescription } from '../types';

/**
 * This component is stateful and should be instantianted per contextIdentifiers.
 */
export default class ContextMentionResource implements MentionProvider {
  private mentionProvider: MentionProvider;
  private contextIdentifiers?: MentionContextIdentifiers;

  constructor(
    mentionProvider: MentionProvider,
    contextIdentifiers?: MentionContextIdentifiers,
  ) {
    this.mentionProvider = mentionProvider;
    this.contextIdentifiers = contextIdentifiers;
  }

  getContextIdentifiers(): MentionContextIdentifiers | undefined {
    return this.contextIdentifiers;
  }

  padArray = (arr: Array<any>, size: number, value: any): Array<any> => {
    const gap = new Array(size);
    gap.fill(undefined);
    return arr ? [...arr, ...gap] : [...gap];
  };

  callWithContextIds = <K extends keyof MentionProvider>(
    f: K,
    declaredArgs: number,
  ): MentionProvider[K] => (...args: any[]) => {
    const argsLength = args ? args.length : 0;
    // cover the scenario where optional parameters are not passed
    let mentionArgs =
      argsLength !== declaredArgs
        ? this.padArray(args, declaredArgs - argsLength, undefined)
        : args;
    return this.contextIdentifiers
      ? this.mentionProvider[f](...mentionArgs, this.contextIdentifiers)
      : this.mentionProvider[f](...mentionArgs);
  };

  callDefault = <K extends keyof MentionProvider>(f: K): MentionProvider[K] => (
    ...args: any[]
  ) => this.mentionProvider[f](...args);

  subscribe = this.callDefault('subscribe');

  unsubscribe = this.callDefault('unsubscribe');

  filter = this.callWithContextIds('filter', 1);

  recordMentionSelection = this.callWithContextIds('recordMentionSelection', 1);

  shouldHighlightMention = this.callDefault('shouldHighlightMention');

  isFiltering = this.callDefault('isFiltering');
}
