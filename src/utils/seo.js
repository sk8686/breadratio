export function buildFAQPageSchema(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return '';

  const mainEntity = questions
    .filter((q) => q.question && q.answer)
    .map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    }));

  if (mainEntity.length === 0) return '';

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  });
}

export function buildSoftwareAppSchema({ name, url, description, applicationCategory = 'EducationalApplication' }) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url,
    description,
    applicationCategory,
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });
}

export function buildBreadcrumbSchema(items) {
  if (!Array.isArray(items) || items.length < 2) return '';

  const listItems = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  });
}
