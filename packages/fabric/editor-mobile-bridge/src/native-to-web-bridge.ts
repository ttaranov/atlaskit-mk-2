export default interface NativeToWebBridge {
  onBoldClicked();
  onItalicClicked();
  onMentionSelect(id: string, displayName: string);
  onMentionPickerResult(result: string);
};
