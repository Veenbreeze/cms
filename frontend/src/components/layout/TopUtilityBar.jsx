import { Mail, Phone } from 'lucide-react'

import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../ui/SocialIcons'

export default function TopUtilityBar({ church }) {
  const hasContact = Boolean(church?.phone || church?.email)
  const hasSocial = Boolean(church?.facebook_url || church?.instagram_url || church?.youtube_url)

  if (!hasContact && !hasSocial) return null

  return (
    <div className="bg-gold-900 text-gold-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-xs md:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {church?.phone && (
            <a href={`tel:${church.phone}`} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3.5 w-3.5" />
              {church.phone}
            </a>
          )}
          {church?.email && (
            <a href={`mailto:${church.email}`} className="flex items-center gap-1.5 hover:text-white">
              <Mail className="h-3.5 w-3.5" />
              {church.email}
            </a>
          )}
        </div>
        {hasSocial && (
          <div className="flex items-center gap-3">
            {church.facebook_url && (
              <a href={church.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white">
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
            )}
            {church.instagram_url && (
              <a href={church.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white">
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
            )}
            {church.youtube_url && (
              <a href={church.youtube_url} target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white">
                <YoutubeIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
