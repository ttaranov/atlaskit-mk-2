declare module 'rusha' {
  type HexDigest = string;

  export class Rusha {
    constructor(size?: number);

    digest(data: string | Buffer | Array<any> | ArrayBuffer): HexDigest;

    digestFromString(data: string): HexDigest;

    digestFromBuffer(data: Buffer | Array<any>): HexDigest;

    digestFromArrayBuffer(data: ArrayBuffer): HexDigest;

    rawDigest(data: string | Buffer | Array<any> | ArrayBuffer): number[];
  }
}
