import { phoneNumberHref } from '@/constant/general';
import { siteUrl } from '@/utils/siteUrl';

// Shared @id so other nodes (e.g. project pages) reference this entity
// instead of declaring a second "AA Design".
export const businessId = `${siteUrl}/#business`;

// Only facts already shown on the site (footer address, phone). No email.
// TODO(content): sameAs — need Facebook/Instagram/YouTube URLs from the owner
export const getBusinessSchema = (locale: string) => [
  {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: 'AA Design',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/logo.png`,
    telephone: phoneNumberHref,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Toà nhà Lạc Hồng Westlake',
      addressLocality: 'Phú Thượng, Tây Hồ',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
    areaServed: { '@type': 'Country', name: 'Vietnam' },
    serviceType: [
      'Architecture design',
      'Interior design',
      'Turnkey construction',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AA Design',
    url: siteUrl,
    inLanguage: locale,
    publisher: { '@id': businessId },
  },
];
