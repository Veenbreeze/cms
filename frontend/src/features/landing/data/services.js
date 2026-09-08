import { BookOpen, Calendar, Church, HandHeart } from 'lucide-react'

export const SERVICES = [
  { key: 'sundayService', icon: Church, nameKey: 'services.sundayServiceName', dayKey: 'services.sundayServiceDay', timeKey: 'services.sundayServiceTime' },
  { key: 'bibleStudy', icon: BookOpen, nameKey: 'services.bibleStudyName', dayKey: 'services.bibleStudyDay', timeKey: 'services.bibleStudyTime' },
  { key: 'prayerMeeting', icon: HandHeart, nameKey: 'services.prayerMeetingName', dayKey: 'services.prayerMeetingDay', timeKey: 'services.prayerMeetingTime' },
  { key: 'specialServices', icon: Calendar, nameKey: 'services.specialServicesName', dayKey: 'services.specialServicesDay', timeKey: 'services.specialServicesTime' },
]
