export type CancelFunction = () => void;

export class UploadController {
  cancelFunction?: CancelFunction;

  constructor() {}

  setCancel(cancelFunction: CancelFunction) {
    this.cancelFunction = cancelFunction;
  }

  cancel() {
    if (this.cancelFunction) {
      this.cancelFunction();
    }
  }
}
