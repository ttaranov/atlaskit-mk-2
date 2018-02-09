import * as React from 'react';
import Editor from './../src/editor';
import { MentionProvider, MentionDescription } from '../../mention/src';
import {
  ErrorCallback,
  InfoCallback,
  ResultCallback,
} from '../../mention/src/api/MentionResource';

//FIXME remove
/*class Subscriber {
    callback?: ResultCallback<MentionDescription[]>;
    errCallback?: ErrorCallback;
    infoCallback?: InfoCallback;
    allResultsCallback?: ResultCallback<MentionDescription[]>
    constructor(
        callback?: ResultCallback<MentionDescription[]>,
        errCallback?: ErrorCallback,
        infoCallback?: InfoCallback,
        allResultsCallback?: ResultCallback<MentionDescription[]>) {
        this.callback = callback;
        this.errCallback = errCallback;
        this.infoCallback = infoCallback;
        this.allResultsCallback = allResultsCallback;
    }
}*/

/**
 * In order to enable mentions in Editor we must set both properties: allowMentions and mentionProvider.
 * So this type is supposed to be a stub version of mention provider. We don't actually need it.
 * TODO consider to move this helper class to somewhere outside example
 */
class MentionProviderImpl implements MentionProvider {
  //subscribers: Map<string, Subscriber> = new Map<string, Subscriber>();
  filter(query?: string): void {
    /*this.subscribers.forEach(value => {
            let resp = [
                {id: "id1", mentionName: "some mention name"},
                {id: "id2", mentionName: "some mention name"},
                {id: "id3", mentionName: "some mention name"},
                {id: "id4", mentionName: "some mention name"}
            ];
            if (value.callback) {
                value.callback(resp, query);
            }
            if (value.allResultsCallback) {
                value.allResultsCallback(resp, query);
            }
        })*/
  }
  recordMentionSelection(mention: MentionDescription): void {}
  shouldHighlightMention(mention: MentionDescription): boolean {
    return false;
  }
  isFiltering(query: string): boolean {
    return false;
  }
  subscribe(
    key: string,
    callback?: ResultCallback<MentionDescription[]>,
    errCallback?: ErrorCallback,
    infoCallback?: InfoCallback,
    allResultsCallback?: ResultCallback<MentionDescription[]>,
  ): void {
    //this.subscribers.set(key, new Subscriber(callback, errCallback,infoCallback,allResultsCallback));
  }
  unsubscribe(key: string): void {
    /*this.subscribers.delete(key);*/
  }
}

export default function Example() {
  return (
    <div>
      <p>Editor that is used by mobile applications.</p>
      <Editor
        appearance="mobile"
        allowHyperlinks={true}
        allowTextFormatting={true}
        allowMentions={true}
        mentionProvider={Promise.resolve(new MentionProviderImpl())}
      />
    </div>
  );
}
