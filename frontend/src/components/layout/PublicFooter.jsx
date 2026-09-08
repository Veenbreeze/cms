import { Church, Mail, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ROUTES } from '../../routes/routePaths'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../ui/SocialIcons'

const EXPLORE_LINKS = [
  { labelKey: 'nav.about', to: ROUTES.ABOUT },
  { labelKey: 'nav.ministries', to: ROUTES.MINISTRIES },
  { labelKey: 'nav.services', to: ROUTES.SERVICES },
  { labelKey: 'nav.media', to: ROUTES.MEDIA },
  { labelKey: 'nav.leadership', to: ROUTES.LEADERSHIP },
  { labelKey: 'nav.faq', to: ROUTES.FAQ },
]

const CONNECT_LINKS = [
  { labelKey: 'nav.contact', to: ROUTES.CONTACT },
  { labelKey: 'nav.prayerRequest', to: ROUTES.PRAYER_REQUEST },
]

export default function PublicFooter({ church }) {
  const { t } = useTranslation()

  const socialLinks = [
    church?.facebook_url && { href: church.facebook_url, Icon: FacebookIcon, label: 'Facebook' },
    church?.instagram_url && { href: church.instagram_url, Icon: InstagramIcon, label: 'Instagram' },
    church?.youtube_url && { href: church.youtube_url, Icon: YoutubeIcon, label: 'YouTube' },
  ].filter(Boolean)

  return (
    <footer id="contact" className="bg-gold-900 text-gold-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-600 text-white">
              <Church className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold text-white">{church?.name || t('app.name')}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-gold-200">{church?.description || t('landing.footerDescription')}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-300">{t('landing.quickLinks')}</h3>
          <ul className="mt-3 space-y-2">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-gold-100 hover:text-white">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-300">{t('nav.contact')}</h3>
          <ul className="mt-3 space-y-2">
            {CONNECT_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-gold-100 hover:text-white">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-3 space-y-2 border-t border-gold-800 pt-3 text-sm text-gold-100">
            {church?.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{church.address}</span>
              </li>
            )}
            {church?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${church.phone}`} className="hover:text-white">
                  {church.phone}
                </a>
              </li>
            )}
            {church?.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${church.email}`} className="hover:text-white">
                  {church.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-300">{t('landing.followUs')}</h3>
          {socialLinks.length > 0 ? (
            <div className="mt-3 flex gap-3">
              {socialLinks.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-800 text-gold-100 hover:bg-gold-700 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gold-300">{t('common.comingSoon')}</p>
          )}
        </div>
      </div>

      <div className="border-t border-gold-800 px-4 py-4 md:px-6">
        <div className="mx-auto max-w-7xl text-center text-xs text-gold-300">
          <p>
            &copy; {new Date().getFullYear()} {church?.name || t('app.name')}. {t('landing.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
