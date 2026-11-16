export const resolveImageUrl = (url: string) => {
  if (!url) return '';
  const baseUrl = process.env.NEXT_PUBLIC_LINK_S3 || '';
  if (url.startsWith('http')) {
    return encodeURI(url);
  }
  // Project photos live on the image CDN when NEXT_PUBLIC_LINK_S3 is set
  // (mirrors the site path, no trailing slash). Other /images files (logo, og
  // image, mobile hero) stay in public/. Empty base = everything local.
  if (url.startsWith('/')) {
    return encodeURI(url.startsWith('/images/project/') ? baseUrl + url : url);
  }
  return baseUrl ? encodeURI(`${baseUrl}/${url}`) : encodeURI(url);
};
