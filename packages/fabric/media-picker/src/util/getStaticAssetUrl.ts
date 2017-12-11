import { AppConfig } from '../config';

export type AssetAlias = 'redirectUrl';

export default function(appConfig: AppConfig, assetAlias: AssetAlias): string {
  const assetUrl = appConfig.html[assetAlias];

  if (appConfig.usingVersions) {
    return `${appConfig.baseUrl}/${appConfig.version}/${assetUrl}`;
  } else {
    return `${appConfig.baseUrl}/${assetUrl}`;
  }
}
