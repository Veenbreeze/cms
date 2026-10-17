import { Landmark, Mail, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'

import { Card, CardBody } from '../components/ui'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/ui/SocialIcons'
import { SERVICES } from '../features/landing/data/services'

export default function ContactPage() {
  const { t } = useTranslation()
  const { church } = useOutletContext()

  const hasContactInfo = Boolean(church?.address || church?.phone || church?.email || church?.instagram_url || church?.youtube_channel_name)
  const givingNumbers = [
    church?.giving_number_1 && { number: church.giving_number_1, label: church.giving_number_1_label },
    church?.giving_number_2 && { number: church.giving_number_2, label: church.giving_number_2_label },
  ].filter(Boolean)
  const socialLinks = [
    church?.facebook_url && { href: church.facebook_url, Icon: FacebookIcon, label: 'Facebook' },
    church?.instagram_url && { href: church.instagram_url, Icon: InstagramIcon, label: 'Instagram' },
    church?.youtube_url && { href: church.youtube_url, Icon: YoutubeIcon, label: 'YouTube' },
  ].filter(Boolean)

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
      <h1 className="mb-2 font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{t('contact.heroTitle')}</h1>
      <p className="mb-8 max-w-xl text-neutral-600 dark:text-neutral-300">{t('contact.intro')}</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardBody className="space-y-4">
            {hasContactInfo ? (
              <>
                {church?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        {t('contact.addressTitle')}
                      </p>
                      <p className="text-neutral-800 dark:text-neutral-100">{church.address}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-sm font-medium text-primary-700 dark:text-primary-300"
                      >
                        {t('contact.getDirections')}
                      </a>
                    </div>
                  </div>
                )}
                {church?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 flex-shrink-0 text-primary-600" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        {t('contact.phoneTitle')}
                      </p>
                      <a
                        href={`tel:${church.phone}`}
                        className="text-neutral-800 hover:text-primary-700 dark:text-neutral-100 dark:hover:text-primary-300"
                      >
                        {church.phone}
                      </a>
                    </div>
                  </div>
                )}
                {church?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 flex-shrink-0 text-primary-600" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        {t('contact.emailTitle')}
                      </p>
                      <a
                        href={`mailto:${church.email}`}
                        className="text-neutral-800 hover:text-primary-700 dark:text-neutral-100 dark:hover:text-primary-300"
                      >
                        {church.email}
                      </a>
                    </div>
                  </div>
                )}
                {(socialLinks.length > 0 || church?.youtube_channel_name) && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {t('contact.followUsTitle')}
                    </p>
                    <div className="flex gap-3">
                      {socialLinks.map(({ href, Icon, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                    {church?.youtube_channel_name && (
                      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                        <span className="font-medium">{t('contact.youtubeChannelLabel')}:</span> {church.youtube_channel_name}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">{t('contact.noContactInfoYet')}</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {t('contact.serviceTimesTitle')}
            </p>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {SERVICES.map((service) => (
                <div key={service.key} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-neutral-700 dark:text-neutral-200">{t(service.nameKey)}</span>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {t(service.dayKey)} · {t(service.timeKey)}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {givingNumbers.length > 0 && (
          <Card className="md:col-span-2">
            <CardBody>
              <div className="mb-3 flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary-600" />
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {t('contact.givingTitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {givingNumbers.map((giving) => (
                  <div key={giving.number} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                    <p className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">{giving.number}</p>
                    {giving.label && <p className="text-sm text-neutral-500 dark:text-neutral-400">{giving.label}</p>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
