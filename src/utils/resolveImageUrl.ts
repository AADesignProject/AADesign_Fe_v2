export const resolveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/')) {
    return encodeURI(url);
  }
  const baseUrl = process.env.NEXT_PUBLIC_LINK_S3 || '';
  return baseUrl ? encodeURI(`${baseUrl}/${url}`) : encodeURI(url);
};
