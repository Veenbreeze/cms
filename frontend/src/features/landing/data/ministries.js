import { Baby, HandHeart, HeartHandshake, Music, ShieldCheck, Sparkles } from 'lucide-react'

export const MINISTRIES = [
  { key: 'youth', icon: Sparkles, nameKey: 'ministries.youthName', descriptionKey: 'ministries.youthDescription' },
  { key: 'women', icon: HeartHandshake, nameKey: 'ministries.womenName', descriptionKey: 'ministries.womenDescription' },
  { key: 'men', icon: ShieldCheck, nameKey: 'ministries.menName', descriptionKey: 'ministries.menDescription' },
  { key: 'children', icon: Baby, nameKey: 'ministries.childrenName', descriptionKey: 'ministries.childrenDescription' },
  { key: 'worship', icon: Music, nameKey: 'ministries.worshipName', descriptionKey: 'ministries.worshipDescription' },
  { key: 'prayer', icon: HandHeart, nameKey: 'ministries.prayerName', descriptionKey: 'ministries.prayerDescription' },
]
