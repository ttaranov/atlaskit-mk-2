export function minWidth({ hasPreview }: { hasPreview: boolean }): number {
  return 240;
}

export function maxWidth({ hasPreview }: { hasPreview: boolean }): number {
  if (hasPreview) {
    return 664;
  } else {
    return 400;
  }
}
