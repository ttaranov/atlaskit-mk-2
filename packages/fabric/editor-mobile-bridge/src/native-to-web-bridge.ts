export default interface NativeToWebBridge {
  makeBold();
  makeItalics();
  onMentionSelect(id: string, displayName: string);
  onMentionPickerResult(result: any[]);
};
