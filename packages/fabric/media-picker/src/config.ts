const isPro = (window as any).NODE_ENV === 'production';
const baseUrl = isPro
  ? 'https://d2lmxj1uc02uys.cloudfront.net'
  : window.location.origin;

export interface AppConfig {
  readonly baseUrl: string;
  readonly usingVersions: boolean;
  readonly version: number;
  readonly html: {
    readonly redirectUrl: string;
  };
}

export default {
  baseUrl,
  usingVersions: isPro,
  version: (window as any).VERSION,
  html: {
    redirectUrl: './html/link-account-handler/handler.html',
  },
} as AppConfig;
