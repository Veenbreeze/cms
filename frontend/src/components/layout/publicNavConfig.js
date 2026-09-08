import { ROUTES } from '../../routes/routePaths'

export const PUBLIC_NAV_ITEMS = [
  { key: 'home', labelKey: 'nav.home', to: ROUTES.HOME },
  {
    key: 'about',
    labelKey: 'nav.about',
    to: ROUTES.ABOUT,
    children: [
      { labelKey: 'nav.whoWeAre', to: `${ROUTES.ABOUT}#who-we-are` },
      { labelKey: 'nav.ourBeliefs', to: `${ROUTES.ABOUT}#beliefs` },
      { labelKey: 'nav.ourHistory', to: `${ROUTES.ABOUT}#history` },
    ],
  },
  {
    key: 'ministries',
    labelKey: 'nav.ministries',
    to: ROUTES.MINISTRIES,
    children: [
      { labelKey: 'ministries.youthName', to: `${ROUTES.MINISTRIES}#youth` },
      { labelKey: 'ministries.womenName', to: `${ROUTES.MINISTRIES}#women` },
      { labelKey: 'ministries.menName', to: `${ROUTES.MINISTRIES}#men` },
      { labelKey: 'ministries.childrenName', to: `${ROUTES.MINISTRIES}#children` },
      { labelKey: 'ministries.worshipName', to: `${ROUTES.MINISTRIES}#worship` },
      { labelKey: 'ministries.prayerName', to: `${ROUTES.MINISTRIES}#prayer` },
    ],
  },
  {
    key: 'services',
    labelKey: 'nav.services',
    to: ROUTES.SERVICES,
    children: [
      { labelKey: 'services.sundayServiceName', to: `${ROUTES.SERVICES}#sundayService` },
      { labelKey: 'services.bibleStudyName', to: `${ROUTES.SERVICES}#bibleStudy` },
      { labelKey: 'services.prayerMeetingName', to: `${ROUTES.SERVICES}#prayerMeeting` },
      { labelKey: 'services.specialServicesName', to: `${ROUTES.SERVICES}#specialServices` },
    ],
  },
  { key: 'media', labelKey: 'nav.media', to: ROUTES.MEDIA },
  {
    key: 'leadership',
    labelKey: 'nav.leadership',
    to: ROUTES.LEADERSHIP,
    children: [
      { labelKey: 'leadership.currentTitle', to: `${ROUTES.LEADERSHIP}#current` },
      { labelKey: 'leadership.historyTitle', to: `${ROUTES.LEADERSHIP}#history` },
    ],
  },
  {
    key: 'newsEvents',
    labelKey: 'nav.newsEvents',
    children: [
      { labelKey: 'nav.announcements', to: `${ROUTES.HOME}#news` },
      { labelKey: 'nav.events', to: `${ROUTES.HOME}#events` },
      { labelKey: 'nav.gallery', to: `${ROUTES.HOME}#gallery` },
      { labelKey: 'nav.faq', to: ROUTES.FAQ },
    ],
  },
  { key: 'contact', labelKey: 'nav.contact', to: ROUTES.CONTACT },
]
