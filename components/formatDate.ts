export const formatDate = (date: string, locale = 'en-US') =>
  new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
