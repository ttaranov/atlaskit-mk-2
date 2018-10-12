function getAvatarUrlByUserId(
  avatarCdnUrl: string,
  id: string,
  sizePx: number = 48,
): string {
  return `${avatarCdnUrl}/${id}?by=id&s=${sizePx}`;
}

export default getAvatarUrlByUserId;
