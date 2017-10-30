/* @flow */
import { NEW_WEBSITE_PREFIX } from './constants';

export const packageUrl = (groupId: string, pkgId: string) =>
  `/${NEW_WEBSITE_PREFIX}/packages/${groupId}/${pkgId}`;

export const packageDocUrl = (groupId: string, pkgId: string, docId: string) =>
  `${packageUrl(groupId, pkgId)}/docs/${docId}`;

export const packageExampleUrl = (groupId: string, pkgId: string, exampleId?: string) =>
  `/examples/${groupId}/${pkgId}${exampleId ? '/' + exampleId : ''}`;
