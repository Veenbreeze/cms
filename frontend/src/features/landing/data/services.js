import { BookOpen, Calendar, Church } from 'lucide-react'

export const SERVICES = [
  { key: 'sundayService', icon: Church, nameKey: 'services.firstSundayServiceName', dayKey: 'services.sundayServiceDay', timeKey: 'services.firstSundayServiceTime' },
  { key: 'secondSundayService', icon: Church, nameKey: 'services.secondSundayServiceName', dayKey: 'services.sundayServiceDay', timeKey: 'services.secondSundayServiceTime' },
  { key: 'wednesdayActivity', icon: Calendar, nameKey: 'services.wednesdayActivityName', dayKey: 'services.wednesdayDay', timeKey: 'services.timeUnconfirmed' },
  { key: 'kikaoUmaki', icon: Calendar, nameKey: 'services.kikaoUmakiName', dayKey: 'services.thursdayDay', timeKey: 'services.timeUnconfirmed' },
  { key: 'bibleStudy', icon: BookOpen, nameKey: 'services.bibleStudyName', dayKey: 'services.fridayDay', timeKey: 'services.timeUnconfirmed' },
]
