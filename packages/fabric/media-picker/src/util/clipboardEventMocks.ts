// this isn't implemented by JSDOM so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
export class MockFile implements File {
  readonly size: number;
  readonly type: string;
  readonly lastModifiedDate: any;
  readonly name: string;
  readonly webkitRelativePath: string;
  msClose(): void {}
  msDetachStream(): any {}
  slice(start?: number, end?: number, contentType?: string): Blob {
    throw new Error('not implemented');
  }
}

// this isn't implemented by JSDOM so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
export class MockFileList extends Array<File> {
  item(index: number): File {
    return this[index];
  }

  static fromArray(files: File[]) {
    const list = new MockFileList();
    files.forEach(file => list.push(file));
    return list;
  }
}

// this isn't implemented by JSDOM so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
export class MockDataTransfer implements DataTransfer {
  dropEffect: string;
  effectAllowed: string;
  readonly files: FileList;
  readonly items: DataTransferItemList;
  readonly types: string[];

  constructor(files?: FileList) {
    this.files = files;
  }

  clearData(format?: string): boolean {
    return false;
  }
  getData(format: string): string {
    return '';
  }
  setData(format: string, data: string): boolean {
    return false;
  }
  setDragImage(image: Element, x: number, y: number): void {}
}

// this isn't implemented by JSDOM, and JSDOM .dispatchEvent() requires that event is an instanceof event,
// so we've implemented it to make Typescript happy
// see https://github.com/tmpvar/jsdom/issues/1568
export class MockClipboardEvent extends Event implements ClipboardEvent {
  clipboardData: DataTransfer;
  constructor(event: string, files: File[] = []) {
    super(event);
    this.clipboardData = new MockDataTransfer(MockFileList.fromArray(files));
  }
}
