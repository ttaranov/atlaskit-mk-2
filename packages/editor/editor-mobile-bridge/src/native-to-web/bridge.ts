export default interface NativeToWebBridge {
  onBoldClicked();
  onItalicClicked();
  onUnderlineClicked();
  onCodeClicked();
  onStrikeClicked();
  onSuperClicked();
  onSubClicked();
  onMentionSelect(id: string, displayName: string);
  onMentionPickerResult(result: string);
  setContent(content: string);
  getContent(): string;
  onMediaPicked(eventName: string, payload: string);
  onPromiseResolved(uuid: string, paylaod: string);
  onPromiseRejected(uuid: string);
  onBlockSelected(blockType: string);
  onOrderedListSelected();
  onBulletListSelected();
  onIndentList();
  onOutdentList();
}
