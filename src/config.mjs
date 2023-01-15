import defaultImage from './assets/images/professional_256.jpg'

const CONFIG = {
  name: 'nerdstep',

  origin: 'https://www.nerdstep.com',
  basePathname: '/',
  trailingSlash: false,

  title: 'nerdstep',
  description:
    'Justin Williams is a full-stack software engineer in Oakland, California.',
  defaultImage: defaultImage,
  // Values: "system" | "light" | "dark" | "light:only" | "dark:only"
  defaultTheme: 'system',

  language: 'en',
  textDirection: 'ltr',

  dateFormatter: new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }),

  googleAnalyticsId: false, // or "G-XXXXXXXXXX",
  googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',
}

export const SITE = { ...CONFIG }
export const DATE_FORMATTER = CONFIG.dateFormatter
