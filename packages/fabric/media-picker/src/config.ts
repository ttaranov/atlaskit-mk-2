export interface AppConfig {
  readonly version: number;
  readonly html: {
    readonly redirectUrl: string;
  };
}

export default {
  version: (window as any).VERSION,
  html: {
    redirectUrl:
      'https://d2lmxj1uc02uys.cloudfront.net/17.0.3/html/link-account-handler/handler.html',
  },
} as AppConfig;
